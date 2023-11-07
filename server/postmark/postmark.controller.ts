import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { baseUrl } from 'server/utils';
import { SendRequesterDto } from './dtos/send-requester.dto';

import { PostmarkService } from './postmark.service';

@Controller('postmark/send')
export class PostmarkController {
  constructor(private readonly postmarkService: PostmarkService) {}

  @Post('recording')
  async recording(@Req() req: Request) {
    console.log('--[postmark][send/recording]');
    return await this.postmarkService.recording(
      parseInt(req.body.date, 10),
      req.body.customerEmail,
      req.body.pageUrl,
      req.body.thumbnailUrl,
      req.body.videoId
    );
  }

  @Post('install/intercom')
  async intercomInstall(@Req() req: Request) {
    console.log('--[postmark][send/intercom/install]');
    return await this.postmarkService.installIntercom(
      req.body.name,
      req.body.email
    );
  }

  @Post('install/zendesk')
  async zendeskInstall(@Req() req: Request) {
    console.log('--[postmark][send/zendesk/install]');
    return await this.postmarkService.installZendesk(
      req.body.name,
      req.body.email
    );
  }

  @Post('requester')
  async sendRequester(@Body() req: SendRequesterDto) {
    const pageUrl = baseUrl(`recording/${req.recordingId}?type=support`);
    return await this.postmarkService.recordingToRequester(
      req.recording.recordedAt,
      req.requester.email,
      pageUrl,
      req.recording.thumbnailUrl,
      req.recordingId,
      req.customer?.email
    );
  }
}
