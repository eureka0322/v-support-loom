import { Injectable } from '@nestjs/common';
import { IsString, IsUUID } from 'class-validator';

@Injectable()
export class RunHooksDto {
  @IsString()
  linkId: string;
  @IsString()
  videoRefId: string;
}
