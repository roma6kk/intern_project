import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  HttpException,
  Logger,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authServiceUrl =
    process.env.AUTH_MICROSERVICE_URL;

  constructor(private readonly httpService: HttpService) {}

  async handleSignUp(signUpDto: SignUpDto) {
    this.logger.log(`Proxying Sign-Up for: ${signUpDto.email}`);
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/register`, signUpDto).pipe(
        catchError((error: AxiosError) => {
          this.handleAxiosError(error);
          throw error;
        }),
      ),
    );
    return data;
  }

  async handleLogin(credentials: LoginDto) {
    this.logger.log(`Proxying Login for: ${credentials.email}`);
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.authServiceUrl}/login`, credentials).pipe(
        catchError((error: AxiosError) => {
          this.handleAxiosError(error);
          throw error;
        }),
      ),
    );
    return data;
  }

  async handleRefresh(refreshToken: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${this.authServiceUrl}/refresh`, { refreshToken })
        .pipe(
          catchError((error: AxiosError) => {
            throw new UnauthorizedException('Refresh failed');
          }),
        ),
    );
    return data;
  }

  async handleLogout(refreshToken: string) {
    await firstValueFrom(
      this.httpService
        .post(`${this.authServiceUrl}/logout`, { refreshToken })
        .pipe(
          catchError(() => {
            return [];
          }),
        ),
    );
  }

  async validateToken(token: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return data;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  async handleOAuthInit(provider: string) {
    return { url: `${this.authServiceUrl}/${provider}` };
  }

  async handleOAuthCallback(provider: string, code: string) {
    this.logger.log(`Proxying OAuth callback for provider: ${provider}`);

    const { data } = await firstValueFrom(
      this.httpService
        .get(`${this.authServiceUrl}/${provider}/callback`, {
          params: { code },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new HttpException(
              error.response?.data || 'OAuth Callback Failed',
              error.response?.status || HttpStatus.UNAUTHORIZED,
            );
          }),
        ),
    );
    return data;
  }

  private handleAxiosError(error: AxiosError) {
    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.response?.data || 'Auth Service Unavailable';
    this.logger.error(`Auth Service Error: ${JSON.stringify(message)}`);

    throw new HttpException(message, status);
  }
}
