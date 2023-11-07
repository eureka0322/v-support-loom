import {
  IsString,
  IsArray,
  IsObject,
  IsDate,
  IsOptional,
} from 'class-validator';

export class RequestLinkDto {
  @IsOptional()
  @IsObject()
  requester?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
  };

  @IsOptional()
  @IsObject()
  customer?: {
    name?: string;
    id?: string;
    email?: string;
    phone?: string;
  };

  @IsOptional()
  @IsArray()
  postRecordHooks?: {
    //id: number;
    name: string;
    url: string;
    //messageAfterFinished: string;
    //userMustWaitUntilFinished: boolean;
    //dependsOn: number[];
  }[];
  // Webhooks to be called once video is recorded/sent

  @IsOptional()
  @IsArray()
  postRecordAddOns?: {
    id: string;
  }[];

  @IsOptional()
  @IsObject()
  metadata?: { [key: string]: string | number | boolean };
  // Metadata to include in the recording entry

  @IsOptional()
  @IsObject()
  reservedMetadata?: { [key: string]: string | number | boolean };
  // Metadata for videosupport to include

  @IsOptional()
  @IsObject()
  displayMetadata?: { [key: string]: string };

  @IsOptional()
  @IsString()
  redirectUrl?: string;
  // Url to redirect user once video is recorded

  @IsOptional()
  @IsDate()
  expireLinkAt?: number;
  // Date to expire link; if not present, doesn't expire

  @IsOptional()
  @IsObject()
  options?: {
    allowRerecord?: boolean;
    enableMessage?: boolean;
    requireLocation?: boolean;
    closeAfterDone?: boolean;
    showLinkAfterDone?: boolean;
    isSupportReply?: boolean;
    tinyUrl?: boolean;
  } = {
    allowRerecord: true,
    enableMessage: true,
    requireLocation: false,
    closeAfterDone: false,
    showLinkAfterDone: false,
    isSupportReply: false,
    tinyUrl: true,
  };

  @IsOptional()
  @IsObject()
  branding?: {
    primaryColour?: string;
    secondaryColour?: string;
    logo?: string;
  };

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class ApiRequestLinkDto extends RequestLinkDto {}
