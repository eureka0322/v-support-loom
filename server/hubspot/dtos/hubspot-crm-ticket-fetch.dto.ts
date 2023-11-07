import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class HubspotCrmTicketFetchDto {
  @IsString()
  userId: string;
  @IsString()
  userEmail: string;
  @IsString()
  associatedObjectId: string;
  @IsString()
  associatedObjectType: string;
  @IsString()
  portalId: string;
  @IsString()
  @Expose({ name: 'hs_ticket_id' })
  ticketId: string;
}
