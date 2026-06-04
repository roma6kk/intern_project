export const AUTH_ERROR_MESSAGES = {
  USER_ALREADY_EXISTS:
    'Пользователь с таким email или именем уже существует',
  ACCOUNT_CREATION_FAILED: 'Не удалось создать аккаунт',
  REGISTRATION_FAILED: 'Не удалось зарегистрироваться',
  INVALID_CREDENTIALS: 'Неверный email или пароль',
  GOOGLE_ACCOUNT_LOGIN:
    'Этот аккаунт зарегистрирован через Google. Войдите с помощью кнопки «Продолжить с Google».',
  INVALID_TOKEN_STRUCTURE: 'Недействительный токен',
  INVALID_OR_EXPIRED_REFRESH_TOKEN: 'Сессия истекла, войдите снова',
  ACCOUNT_NOT_FOUND: 'Аккаунт не найден',
  TOKEN_BLACKLISTED: 'Сессия завершена',
  EMAIL_NOT_FOUND: 'Email не найден',
  TRY_AGAIN_PREFIX: 'Повторите попытку через',
  RESET_CODE_SENT: 'Код отправлен на email',
  RESET_CODE_EXPIRED: 'Срок действия кода истёк',
  TOO_MANY_ATTEMPTS: 'Слишком много попыток',
  INVALID_RESET_CODE: 'Неверный код подтверждения',
  PASSWORD_UPDATED: 'Пароль успешно изменён',
  GOOGLE_NO_EMAIL: 'У аккаунта Google не указан email',
  GOOGLE_TOKEN_EXCHANGE_FAILED: 'Не удалось войти через Google',
  GOOGLE_USER_INFO_FAILED: 'Не удалось получить данные от Google',
  REFRESH_TOKEN_REQUIRED: 'Требуется токен обновления',
  REFRESH_FAILED: 'Не удалось обновить сессию',
  ACCESS_TOKEN_REQUIRED: 'Требуется токен доступа',
  LOGGED_OUT: 'Вы вышли из аккаунта',
  CODE_REQUIRED: 'Требуется код авторизации',
  OAUTH_FAILED: 'Не удалось войти через Google',
  EMAIL_REQUIRED: 'Укажите email',
  RESET_FIELDS_REQUIRED: 'Укажите email, код и новый пароль',
  PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 8 символов',
  RESET_CODE_INVALID_FORMAT: 'Код должен содержать 6 цифр',
  tryAgainIn: (seconds: number) =>
    `${AUTH_ERROR_MESSAGES.TRY_AGAIN_PREFIX} ${seconds} сек.`,
} as const;

export const ERROR_MESSAGES = {
  METHOD_NOT_IMPLEMENTED: 'Метод не реализован',
  INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',
  TOO_MANY_REQUESTS: 'Слишком много запросов, повторите позже',
  NOT_FOUND: 'Ресурс не найден',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
