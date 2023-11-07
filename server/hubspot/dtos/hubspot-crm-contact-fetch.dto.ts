import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HubspotCrmContactFetchDto {
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
  email: string;
  @IsString()
  firstname: string;
}
