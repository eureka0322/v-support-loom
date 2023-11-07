import { IsString } from 'class-validator';

export class SlackInstallDto {
  @IsString()
  teamId: string;

  @IsString()
  companyName: string;

  @IsString()
  botToken: string;
}
