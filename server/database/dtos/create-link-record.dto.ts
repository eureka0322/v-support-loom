import { IsOptional, IsString, IsUUID } from 'class-validator';
import { RequestLinkDto } from '../../api/dtos/link-request.dto';

export class CreateLinkRecordDto extends RequestLinkDto {
  @IsUUID()
  linkId: string;
  @IsOptional()
  @IsUUID()
  clientId?: string;
  @IsUUID()
  customerId: string;
  currentDate: any;
}
