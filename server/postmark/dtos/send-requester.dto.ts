import { Injectable } from '@nestjs/common';
import { IsObject, IsOptional, IsString } from 'class-validator';

@Injectable()
export class SendRequesterDto {
  @IsObject()
  requester: {
    email: string;
  };
  @IsString()
  recordingId: string;

  @IsObject()
  recording: {
    recordedAt: number;
    thumbnailUrl: string;
  };

  @IsOptional()
  @IsObject()
  customer?: {
    email?: string;
  };
}
