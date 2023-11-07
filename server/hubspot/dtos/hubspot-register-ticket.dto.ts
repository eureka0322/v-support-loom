import { Injectable } from '@nestjs/common';
import { IsNumber, IsObject, ValidateNested } from 'class-validator';

@Injectable()
export class RegisterTicketDto {
  @IsNumber()
  portalId: number;
  @IsObject()
  properties: {
    hs_thread_id: {
      value: string;
    };
    hs_ticket_id_to_restore: {
      value: string;
    };
  };
}
