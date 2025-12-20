import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username can not be empty' })
  username: string;

  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number can not be empty' })
  phoneNumber: string;

  @IsString({ message: 'Email must be a string' })
  @IsOptional()
  @IsEmail({}, { message: 'Wrong email' })
  email?: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password can not be empty' })
  @MinLength(8, { message: 'Password must have at least 8 symbols' })
  password: string;

  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  secondName: string;
}
