import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Avatar {
  @IsString()
  @IsOptional()
  image_url?: string;
}
class Admin {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  job_title?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => Avatar)
  avatar?: Avatar;
}
class Context {
  @IsNumber()
  @IsOptional()
  conversation_id?: number;
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

class InitializeBodyDto {
  @ValidateNested()
  @Type(() => Admin)
  @IsDefined()
  admin: Admin;

  @ValidateNested()
  @Type(() => Context)
  @IsDefined()
  context: Context;

  @ValidateNested()
  @Type(() => Card)
  @IsDefined()
  card_creation_options?: Card;
}

export { InitializeBodyDto, Admin };
