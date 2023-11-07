import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ClientId } from 'server/api/api.decorator';
import { ApiGuard } from 'server/guards/api.guard';
import { RolesGuard } from 'server/guards/roles.guard';
import { Roles } from 'server/roles/roles.decorator';
import { SlackService } from './slack.service';
import { HookPayloadDto } from '../api/dtos/hook-payload.dto';
import { SlackInstallDto } from './dtos/slack-install.dto';
import { SendToChannelDto } from './dtos/send-to-channel.dto';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post('send-to-channel')
  @Roles('vs-hooks')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async sendToChanenl(
    @ClientId() clientId: string,
    @Body() body: SendToChannelDto
  ) {
    await this.slackService.sendToChannel(
      clientId,
      body.recordingId,
      body.customData.channelId,
      body.customData.additionalMetadata
    );
  }

  @Post('message-video')
  @Roles('vs-hooks')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async messageVideo(
    @ClientId() clientId: string,
    @Body() body: HookPayloadDto
  ) {
    // TODO: get requester
    const userId = body.reservedMetadata?.slackUserId;
    const recordingId = body.recordingId;
    if (userId) {
      await this.slackService.sendToChannel(clientId, recordingId, userId);
    } else {
      const msg = `No Slack user ID (client ${clientId})`;
      console.error(msg);
      throw new BadRequestException(msg);
    }
  }

  @Post('install')
  @Roles('slack_app')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async installSlack(@ClientId() clientId: string, @Body() body: any) {
    const companyName = body['team_name'];
    const teamId = body['team_id'];
    const botToken = body['bot_token'];
    return await this.slackService.install(
      clientId,
      companyName,
      teamId,
      botToken,
      body
    );
  }
}
