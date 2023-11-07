import { Type } from 'class-transformer';
import {
  IsOptional,
  IsDefined,
  IsString,
  ValidateNested,
  IsNumber,
  IsBoolean,
  IsObject,
} from 'class-validator';

class Admin {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;
}

class Intercom {
  @IsDefined()
  @ValidateNested()
  @Type(() => Admin)
  admin: Admin;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsNumber()
  @IsOptional()
  conversationId?: number;

  @IsString()
  workspaceId: string;

  @IsBoolean()
  @IsOptional()
  isSupportReply?: boolean;
}

class Recording {
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

class Device {
  @IsOptional()
  browser?: Record<string, any>;
  @IsOptional()
  os?: Record<string, any>;
  @IsOptional()
  engine?: Record<string, any>;
  @IsOptional()
  platform?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

class SubmitBodyDto {
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
  reservedMetadata: {
    intercomContactId: string;
    intercomAdminId: string;
    intercomConversationId?: string;
    intercomSupportReply?: boolean;
  };
}

export { SubmitBodyDto };
