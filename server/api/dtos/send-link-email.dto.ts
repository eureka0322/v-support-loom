import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiRequestLinkDto } from './link-request.dto';

export class ApiSendLinkEmailDto extends ApiRequestLinkDto {
  @IsEmail()
  senderEmail: string;

  @IsEmail()
  receiverEmail: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsString()
  @IsOptional()
  personalMessage?: string;
}
