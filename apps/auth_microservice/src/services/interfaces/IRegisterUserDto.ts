export interface IRegisterUserDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  secondName?: string;
  phoneNumber?: string;
}