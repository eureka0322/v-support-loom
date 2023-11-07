import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';

export class InboxAdminDto {
  @IsString()
  id: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  email?: string;
}

export class InboxContactDto {
  @IsString()
  id: string;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  email?: string;
}

@Injectable()
export class InitializeInboxDto {
  @ValidateNested()
  @Type(() => InboxAdminDto)
  admin: InboxAdminDto;

  @ValidateNested()
  @Type(() => InboxContactDto)
  contact: InboxContactDto;

  @IsObject()
  conversation: {
    id: string;
  };

  @IsString()
  @Expose({ name: 'workspace_id' })
  workspaceId: string;
}
