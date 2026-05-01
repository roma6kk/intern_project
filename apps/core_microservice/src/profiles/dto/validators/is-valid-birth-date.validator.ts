import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

const MIN_AGE_YEARS = 13;
const MAX_AGE_YEARS = 120;

export function IsValidBirthDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidBirthDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature required by class-validator
        validate(value: unknown, args: ValidationArguments) {
          if (value == null || value === '') return true;

          let dateStr: string;
          if (typeof value === 'string') {
            dateStr = value;
          } else if (value instanceof Date) {
            dateStr = value.toISOString();
          } else if (typeof value === 'number' && !Number.isNaN(value)) {
            dateStr = String(value);
          } else {
            return false;
          }
          const date = new Date(dateStr);

          if (Number.isNaN(date.getTime())) return false;

          const now = new Date();
          const minDate = new Date(now);
          minDate.setFullYear(minDate.getFullYear() - MAX_AGE_YEARS);
          const maxDate = new Date(now);
          maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE_YEARS);

          return date >= minDate && date <= maxDate;
        },
        defaultMessage() {
          return `Birth date must be between ${MAX_AGE_YEARS} and ${MIN_AGE_YEARS} years ago`;
        },
      },
    });
  };
}
