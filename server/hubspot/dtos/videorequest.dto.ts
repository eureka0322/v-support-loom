import { IsString } from 'class-validator';

export class HubspotVideoRequestDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
}
