import { IsString } from 'class-validator';

export class HubspotOauthDto {
  @IsString()
  code: string;
}
