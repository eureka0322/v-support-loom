import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Injectable()
export class TicketSidebarDto {
  @IsString()
  origin: string;

  @IsString()
  app_guid: string;
}
