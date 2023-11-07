import { IsObject, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  linkId: string;
  @IsString()
  clientId: string;
  @IsString()
  customerId: string;
  @IsString()
  recordingId: string;
  @IsObject()
  recording: {
    message: string;
    videoUrl: string;
    recordedAt: number;
    receiverEmail: string;
    thumbnailUrl: string;
    isMuted: false;
  };
  @IsObject()
  metadata: {
    hubspotConversationId: string;
    hubspotId: string;
  };
}
