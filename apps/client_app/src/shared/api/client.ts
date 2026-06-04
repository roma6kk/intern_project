import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

function extractResponseMessage(data: unknown): string | undefined {
  if (!data) return undefined;
  if (typeof data === 'string') return data;

  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>;
    const message = record.message;

    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.map(String).join(', ');
    if (typeof message === 'object' && message !== null) {
      return extractResponseMessage(message);
    }
  }

  return undefined;
}

export function getApiErrorMessage(error: unknown, fallback = 'Произошла ошибка'): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as ApiError).message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as AxiosError).response;
    return extractResponseMessage(response?.data) || fallback;
  }

  return fallback;
}

const AUTH_PATHS_WITHOUT_REFRESH = [
  '/auth/login',
  '/auth/signup',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

function shouldSkipTokenRefresh(url?: string): boolean {
  if (!url) return false;
  return AUTH_PATHS_WITHOUT_REFRESH.some((path) => url.includes(path));
}

class ApiErrorHandler {
  static handle(error: AxiosError): ApiError {
    if (!error.response) {
      return {
        message: error.code === 'ECONNABORTED' ? 'Превышено время ожидания' : 'Ошибка сети',
        code: error.code,
      };
    }

    const status = error.response.status;
    const serverMessage = extractResponseMessage(error.response.data);

    switch (status) {
      case 400:
        return { message: serverMessage || 'Неверный запрос', status };
      case 401:
        return { message: serverMessage || 'Неверные учётные данные', status };
      case 403:
        return { message: serverMessage || 'Доступ запрещен', status };
      case 404:
        return { message: serverMessage || 'Ресурс не найден', status };
      case 413:
        return { message: serverMessage || 'Файл слишком большой для загрузки', status };
      case 422:
        return { message: serverMessage || 'Ошибка валидации', status };
      case 429:
        return { message: serverMessage || 'Слишком много запросов', status };
      case 500:
        return { message: serverMessage || 'Внутренняя ошибка сервера', status };
      default:
        return { message: serverMessage || 'Произошла ошибка', status };
    }
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
});

let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = api
      .post<{ accessToken: string }>('/auth/refresh', {})
      .then((res) => {
        const newAccessToken = res.data.accessToken;
        Cookies.set('accessToken', newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;
    
    if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(ApiErrorHandler.handle(error));
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipTokenRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove('accessToken');
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(ApiErrorHandler.handle(refreshError as AxiosError));
      }
    }

    return Promise.reject(ApiErrorHandler.handle(error));
  }
);
export default api;
