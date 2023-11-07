import { IsString } from 'class-validator';

export class UpdateBrandingDto {
  @IsString()
  primaryColour: string;
  @IsString()
  secondaryColour: string;
  @IsString()
  logo: string;
}
