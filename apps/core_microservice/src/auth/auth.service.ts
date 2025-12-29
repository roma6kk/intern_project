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
import { AuthResponse } from './interfaces/IAuthResponse';
import * as dotenv from 'dotenv';
import { ICurrentUser } from './interfaces/ICurrentUser';
dotenv.config();

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authServiceUrl = process.env.AUTH_MICROSERVICE_URL;
  constructor(private readonly httpService: HttpService) {}

  async handleSignUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    this.logger.log(`Proxying Sign-Up for: ${signUpDto.email}`);
    const { data } = await firstValueFrom(
      this.httpService
        .post<AuthResponse>(`${this.authServiceUrl}/register`, signUpDto)
        .pipe(
          catchError((error: AxiosError) => {
            this.handleAxiosError(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  async handleLogin(credentials: LoginDto): Promise<AuthResponse> {
    this.logger.log(`Proxying Login for: ${credentials.email}`);
    const { data } = await firstValueFrom(
      this.httpService
        .post<AuthResponse>(`${this.authServiceUrl}/login`, credentials)
        .pipe(
          catchError((error: AxiosError) => {
            this.handleAxiosError(error);
            throw error;
          }),
        ),
    );
    return data;
  }

  async handleRefresh(refreshToken: string): Promise<AuthResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<AuthResponse>(`${this.authServiceUrl}/refresh`, { refreshToken })
        .pipe(
          catchError(() => {
            throw new UnauthorizedException('Refresh failed');
          }),
        ),
    );
    return data;
  }

  async handleLogout(refreshToken: string): Promise<void> {
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

  async validateToken(token: string): Promise<ICurrentUser> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ICurrentUser>(`${this.authServiceUrl}/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );
      return data;
    } catch {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  handleOAuthInit(provider: string): { url: string } {
    return { url: `${this.authServiceUrl}/${provider}` };
  }

  async handleOAuthCallback(
    provider: string,
    code: string,
  ): Promise<AuthResponse> {
    this.logger.log(`Proxying OAuth callback for provider: ${provider}`);

    const { data } = await firstValueFrom(
      this.httpService
        .post<AuthResponse>(`${this.authServiceUrl}/oauth/exchange-code`, {
          code,
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
