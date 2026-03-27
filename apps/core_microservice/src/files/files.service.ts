import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly endpoint: string;
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.endpoint = this.configService.getOrThrow<string>('AWS_ENDPOINT');

    this.s3Client = new S3Client({
      region: this.region, // Должно быть ru-central1 в .env
      endpoint: this.endpoint, // Должно быть https://storage.yandexcloud.net
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
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
      return `${this.endpoint.replace(/\/$/, '')}/${this.bucketName}/${fileName}`;
    } catch (error) {
      const err = error as any;
      const httpStatusCode = err?.$metadata?.httpStatusCode;
      const requestId = err?.$metadata?.requestId ?? err?.RequestId;
      const code = err?.Code ?? err?.name;

      this.logger.error('Error uploading file to S3', {
        code,
        message: err?.message,
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
}