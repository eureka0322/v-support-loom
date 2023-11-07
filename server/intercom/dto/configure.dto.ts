import { Expose, Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Admin } from './initialize-body.dto';

export class ConfigureDto {
  @IsString()
  @Expose({ name: 'workspace_id' })
  workspaceId: string;
  @ValidateNested()
  @Type(() => Admin)
  admin: Admin;

  @IsObject()
  @IsOptional()
  @Expose({ name: 'input_values' })
  inputValues: any;
}
