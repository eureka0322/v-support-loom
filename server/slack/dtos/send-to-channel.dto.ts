import { IsObject } from 'class-validator';
import { HookPayloadDto } from 'server/api/dtos/hook-payload.dto';

export class SendToChannelDto extends HookPayloadDto {
  @IsObject()
  customData: {
    channelId: string;
    additionalMetadata?: string[];
  };
}
