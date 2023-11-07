import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GenerateWatchUrlDto {
  @IsString()
  recordingId: string;

  @IsString()
  side: 'support' | 'customer';

  @IsOptional()
  @IsEmail()
  agent?: string;
}
