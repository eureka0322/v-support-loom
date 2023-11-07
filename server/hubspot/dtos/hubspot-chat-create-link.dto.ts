import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUppercase,
} from 'class-validator';

// TODO(Joao): nested validators

export class HubspotChatCreateLinkDto {
  @IsNumber()
  portalId: number;
  @IsObject()
  userMessage: {
    message: string;
    quickReply: string | null;
  };
  @IsObject()
  bot: {
    nickname: string;
    conversationChannelType: string;
  };
  @IsObject()
  module: {
    botNickname: string;
    fallbackNextModuleName: string | null;
    failureNextModuleNickname: string | null;
    modyleType: string;
    nickname: string;
    prompt: string | null;
    promptHtml: string | null;
    config: {
      id: number;
      timeout: number;
      customerPayload: string | null;
      expectingResponse: boolean;
    };
  };
  @IsObject()
  session: {
    vid: number;
    conversationId: number;
    botNickname: string;
    currentModuleNickname: string;
    sessionStartedAt: number;
    lastInteractionAt: number;
    state: string;
    customState: Object;
    responseExpected: boolean;
    parsedResponses: Object;
    properties: Object;
  };
  @IsOptional()
  @IsObject()
  customPayload: Object;
}
