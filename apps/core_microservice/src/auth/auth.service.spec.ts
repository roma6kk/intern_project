import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockHttpService = {
  post: jest.fn(),
  get: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('http://localhost:3001/internal/auth'),
};

describe('AuthService', () => {
  let service: AuthService;
  let httpService: typeof mockHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleLogin', () => {
    const loginDto = { email: 'test@test.com', password: 'password' };
    const mockAuthResponse = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: '1', username: 'test', email: 'test@test.com' },
    };

    it('should return auth data on successful login', async () => {
      const axiosResponse: AxiosResponse = {
        data: mockAuthResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as AxiosResponse['config'],
      };

      httpService.post.mockReturnValue(of(axiosResponse));

      const result = await service.handleLogin(loginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(httpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        loginDto,
      );
    });

    it('should throw HttpException when Auth Service returns error', async () => {
      const errorResponse = {
        response: {
          data: { message: 'Invalid credentials' },
          status: 401,
        },
      };

      httpService.post.mockReturnValue(throwError(() => errorResponse));

      await expect(service.handleLogin(loginDto)).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
