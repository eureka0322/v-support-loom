import {
  IsString,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsObject,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Recording {
  @IsString()
  videoUrl: string;

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  recordedAt: number;

  @IsString()
  @IsOptional()
  message?: string;

  @IsBoolean()
  @IsOptional()
  isMuted?: boolean;

  @IsBoolean()
  @IsOptional()
  audio?: boolean;
}

export class HookPayloadDto {
  @IsString()
  linkId: string;

  @IsString()
  clientId: string;

  @IsString()
  customerId: string;

  @IsString()
  recordingId: string;

  @ValidateNested()
  @Type(() => Recording)
  recording: Recording;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string | number | boolean>;

  @IsObject()
  @IsOptional()
  reservedMetadata: Record<string, string>;
}
