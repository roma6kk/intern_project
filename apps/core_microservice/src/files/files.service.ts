import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly endpoint: string;
  private readonly publicEndpoint: string;
  private readonly useSignedUrls: boolean;
  private readonly signedUrlTtlSeconds: number;
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.endpoint = this.configService.getOrThrow<string>('AWS_ENDPOINT');
    this.publicEndpoint = this.configService.get<string>(
      'AWS_PUBLIC_ENDPOINT',
      this.endpoint,
    );
    this.useSignedUrls =
      this.configService.get<string>('AWS_USE_SIGNED_URLS', 'true') === 'true';
    this.signedUrlTtlSeconds = this.configService.get<number>(
      'AWS_SIGNED_URL_TTL_SECONDS',
      3600,
    );

    this.s3Client = new S3Client({
      region: this.region, // Должно быть ru-central1 в .env
      endpoint: this.endpoint, // Должно быть https://storage.yandexcloud.net
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      // КРИТИЧЕСКИ ВАЖНО для совместимости с Yandex Cloud
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    try {
      // ИСПОЛЬЗУЕМ КЛАССИЧЕСКИЙ PutObjectCommand
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ВАЖНО: Мы полностью убрали ACL. Yandex Cloud будет использовать
        // настройки публичного доступа, которые вы задали в панели управления.
      });

      // Отправляем файл одним запросом
      await this.s3Client.send(command);

      // Формируем итоговую публичную ссылку на картинку.
      // Для Яндекса получится: https://storage.yandexcloud.net/ваше-имя-бакета/имя-файла.jpg
      return `${this.publicEndpoint.replace(/\/$/, '')}/${this.bucketName}/${fileName}`;
    } catch (error) {
      const err = (error ?? {}) as Record<string, unknown>;
      const metadata =
        typeof err.$metadata === 'object' && err.$metadata !== null
          ? (err.$metadata as Record<string, unknown>)
          : undefined;
      const httpStatusCode =
        typeof metadata?.httpStatusCode === 'number'
          ? metadata.httpStatusCode
          : undefined;
      const requestId =
        (typeof metadata?.requestId === 'string'
          ? metadata.requestId
          : undefined) ??
        (typeof err.RequestId === 'string' ? err.RequestId : undefined);
      const code =
        (typeof err.Code === 'string' ? err.Code : undefined) ??
        (typeof err.name === 'string' ? err.name : undefined);
      const message = typeof err.message === 'string' ? err.message : undefined;

      this.logger.error('Error uploading file to S3', {
        code,
        message,
        httpStatusCode,
        requestId,
        bucket: this.bucketName,
        key: fileName,
        region: this.region,
        endpoint: this.endpoint,
      });

      throw new InternalServerErrorException('File upload failed');
    }
  }

  async getReadableUrl(originalUrl: string): Promise<string> {
    if (!originalUrl) {
      return originalUrl;
    }

    if (!this.useSignedUrls) {
      const key = this.extractObjectKey(originalUrl);
      if (!key) {
        return originalUrl;
      }
      return `${this.publicEndpoint.replace(/\/$/, '')}/${this.bucketName}/${key}`;
    }

    if (this.isAlreadySignedUrl(originalUrl)) {
      return originalUrl;
    }

    const key = this.extractObjectKey(originalUrl);
    if (!key) {
      return originalUrl;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, {
        expiresIn: this.signedUrlTtlSeconds,
      });
    } catch {
      this.logger.warn(
        `Failed to create signed URL for key "${key}", falling back to original URL`,
      );
      return originalUrl;
    }
  }

  private isAlreadySignedUrl(url: string): boolean {
    return /[?&]X-Amz-Signature=/i.test(url);
  }

  private extractObjectKey(urlOrKey: string): string | null {
    try {
      const parsed = new URL(urlOrKey);
      const cleanPath = parsed.pathname.replace(/^\/+/, '');
      if (!cleanPath) {
        return null;
      }

      if (cleanPath.startsWith(`${this.bucketName}/`)) {
        return cleanPath.slice(this.bucketName.length + 1);
      }

      return cleanPath;
    } catch {
      const clean = urlOrKey.replace(/^\/+/, '');
      if (!clean) {
        return null;
      }
      if (clean.startsWith(`${this.bucketName}/`)) {
        return clean.slice(this.bucketName.length + 1);
      }
      return clean;
    }
  }
}
