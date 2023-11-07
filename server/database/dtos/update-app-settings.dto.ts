import { IsString } from 'class-validator';

export class UpdateAppReferrerDto {
  @IsString()
  referrerUrl: string;
}
