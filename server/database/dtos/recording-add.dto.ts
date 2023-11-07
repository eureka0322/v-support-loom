import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DeviceDescriptionDto {
  @IsObject()
  browser: {
    name: string;
    version: string;
  };
  @IsObject()
  os: {
    name: string;
  };
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsObject()
  platform: {
    type: string;
  };
  @IsObject()
  engine: {
    name: string;
  };
}

export class RecordingDescriptionDto {
  constructor(
    videoUrl: string,
    thumbnailUrl: string,
    recordedAt: number,
    message: string,
    caption: string,
    receiverEmail: string,
    isMuted: boolean,
    linkExpiration: number,
    compressed: boolean
  ) {
    this.videoUrl = videoUrl;
    this.thumbnailUrl = thumbnailUrl;
    this.recordedAt = recordedAt;
    this.message = message;
    this.caption = caption;

    this.receiverEmail = receiverEmail;
    this.isMuted = isMuted;
    this.linkExpiration = linkExpiration;
    this.compressed = compressed;
  }

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsString()
  videoUrl: string;

  @IsString()
  thumbnailUrl: string;

  @IsNumber()
  recordedAt: number;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  caption: string;

  @IsString()
  @IsOptional()
  receiverEmail?: string;

  @IsNumber()
  // TODO(Joao): _s3 is not optional after first deployment
  @IsOptional()
  linkExpiration: number;

  @IsBoolean()
  isMuted: boolean;

  @IsBoolean()
  compressed: boolean;
}

export class RecordingAddDto {
  @IsString()
  recordingId: string;

  @IsString()
  linkId: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsString()
  customerId: string;


  @ValidateNested()
  @Type(() => RecordingDescriptionDto)
  recording: RecordingDescriptionDto;

  @ValidateNested()
  @Type(() => DeviceDescriptionDto)
  device: DeviceDescriptionDto;
}
