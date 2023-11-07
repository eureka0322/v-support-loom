import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DatabaseService } from '../database/database.service';
import { Server, Socket } from 'socket.io';
import { baseUrl } from 'server/utils';
import { Inject, Injectable, UseGuards, forwardRef } from '@nestjs/common';

import { WsGuard } from './notification.guard';
import { WsClientId } from './notification.interceptor';
import { ApiService } from 'server/api/api.service';
import { ClientId } from 'server/api/api.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    private readonly databaseService: DatabaseService
  ) {}

  @SubscribeMessage('qr-read')
  async qrRead(@MessageBody() linkId: string) {
    const link = await this.databaseService.getLinkById(linkId);
    if (link.reservedMetadata?.wsSessionId) {
      const sessionId = link.reservedMetadata.wsSessionId as string;
      this.server.to(sessionId).emit('link-status', { data: 'qr-read' });
    }
  }

  @SubscribeMessage('video-recording')
  async videoRecording(@MessageBody() linkId: string) {
    const link = await this.databaseService.getLinkById(linkId);
    if (link.reservedMetadata?.wsSessionId) {
      const sessionId = link.reservedMetadata.wsSessionId as string;
      this.server
        .to(sessionId)
        .emit('link-status', { data: 'video-recording' });
    }
  }

  @SubscribeMessage('video-recorded')
  async videoRecorded(@MessageBody() linkId: string) {
    const link = await this.databaseService.getLinkById(linkId);
    if (link.reservedMetadata?.wsSessionId) {
      const sessionId = link.reservedMetadata.wsSessionId as string;
      this.server.to(sessionId).emit('link-status', { data: 'video-recorded' });
    }
  }

  @SubscribeMessage('video-processed')
  async videoProcessed(
    @MessageBody() message: { linkId: string; recordingId: string }
  ) {
    const linkId = message.linkId;
    const recordingId = message.recordingId;

    const link = await this.databaseService.getLinkById(linkId);
    const recording = await this.databaseService.getRecordingByUuid(
      recordingId
    );
    if (link.reservedMetadata?.wsSessionId) {
      const sessionId = link.reservedMetadata.wsSessionId as string;
      this.server.to(sessionId).emit('link-status', {
        data: 'video-processed',
        url: baseUrl(`/recording/${recordingId}?type=support`),
        videoUrl: recording?.data.recording.videoUrl,
      });
    }
    if (link.clientId && recording) {
      const watchUrl = await this.apiService.generateWatchUrl(
        link.clientId,
        recordingId,
        'support',
        recording.data.requester?.email as string | undefined
      );
      this.server.to(link.clientId).emit('new-video', {
        watchUrl,
        ...recording.data,
      });
    }
  }

  @SubscribeMessage('join-updates')
  @UseGuards(WsGuard)
  async joinUpdates(
    @WsClientId() clientId: string,
    @ConnectedSocket() socket: Socket
  ) {
    socket.join(clientId);
  }

  async videoAssigned(clientId: string, recordingId: string) {
    this.server.to(clientId).emit('video-assigned', recordingId);
  }
}
