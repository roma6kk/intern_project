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

class ApiErrorHandler {
  static handle(error: AxiosError): ApiError {
    if (!error.response) {
      return {
        message: error.code === 'ECONNABORTED' ? 'Превышено время ожидания' : 'Ошибка сети',
        code: error.code
      };
    }

    const status = error.response.status;
    const data = error.response.data as { message?: string };

    switch (status) {
      case 400:
        return { message: data?.message || 'Неверный запрос', status };
      case 403:
        return { message: 'Доступ запрещен', status };
      case 404:
        return { message: 'Ресурс не найден', status };
      case 422:
        return { message: data?.message || 'Ошибка валидации', status };
      case 429:
        return { message: 'Слишком много запросов', status };
      case 500:
        return { message: 'Внутренняя ошибка сервера', status };
      default:
        return { message: data?.message || 'Произошла ошибка', status };
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

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
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
