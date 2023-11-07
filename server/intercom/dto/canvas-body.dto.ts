import { Expose, Type } from 'class-transformer';
import {
  IsOptional,
  IsDefined,
  IsString,
  ValidateNested,
  IsNumber,
  IsObject,
} from 'class-validator';

import { Admin } from './initialize-body.dto';

class Context {
  @IsString()
  @IsOptional()
  referrer?: string;
}

class Contact {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @IsOptional()
  custom_attributes?: Record<string, any>;
}

class Card {
  @IsString()
  @IsOptional()
  frame_title?: string;

  @IsString()
  @IsOptional()
  frame_description?: string;

  @IsString()
  @IsOptional()
  frame_button?: string;
}

class StoredDate {
  @IsDefined()
  @ValidateNested()
  @Type(() => Admin)
  admin: Admin;

  @ValidateNested()
  @IsOptional()
  @Type(() => Card)
  card?: Card;

  @IsNumber()
  @IsOptional()
  conversation_id?: string;
}

class Canvas {
  @IsDefined()
  @ValidateNested()
  @Type(() => StoredDate)
  stored_data: StoredDate;
}

class CanvasBodyDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => Contact)
  contact?: Contact;

  @IsDefined()
  @ValidateNested()
  @Type(() => Context)
  context: Context;

  @IsDefined()
  @ValidateNested()
  @Type(() => Canvas)
  canvas: Canvas;

  @IsDefined()
  @IsString()
  @Expose({ name: 'workspace_id' })
  workspaceId: string;
}

export { CanvasBodyDto };
