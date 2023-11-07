import { IsObject, IsOptional, IsString } from 'class-validator';

export class InclusiveMatchDto {
  key: string;
  value: string;
}

export class ApiListVideosInclusiveDto {
  @IsOptional()
  @IsString()
  agentEmail?: string;

  @IsObject()
  match: { [key: string]: string };
}
