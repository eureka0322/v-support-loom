import { IsEmail } from 'class-validator';

export class RequestAccessDto {
  @IsEmail()
  email: string;
}
