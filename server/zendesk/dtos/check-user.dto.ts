import { Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';

@Injectable()
export class CheckUserDto {
  @IsString()
  email: string;
}
