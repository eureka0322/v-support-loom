import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { baseUrl } from '../utils';

import { InitializeBodyDto } from './dto/initialize-body.dto';
import { SubmitBodyDto } from './dto/submit-body.dto';
import { ConfigureDto } from './dto/configure.dto';
import { IntercomService } from './intercom.service';
import { CanvasBodyDto } from './dto/canvas-body.dto';
import { InitializeInboxDto } from './dto/initialize-inbox.dto';
import { IntercomGuard } from 'server/guards/intercom.guard';

@Controller('intercom')
export class IntercomController {
  constructor(private readonly intercomService: IntercomService) {}

  @Post('initialize')
  @UseGuards(IntercomGuard)
  initialize(@Body() body: InitializeBodyDto) {
    console.log('[intercom][init]');

    return {
      canvas: {
        content_url: baseUrl('intercom/canvas'),
        stored_data: {
          admin: {
            id: body.admin.id,
            email: body.admin.email,
            name: body.admin.name,
            job_title: body.admin.job_title,
            photo: body.admin.avatar?.image_url,
          },
          conversation_id: body.context.conversation_id,
          card: {
            ...body.card_creation_options,
          },
        },
      },
    };
  }

  @Post('configure')
  @UseGuards(IntercomGuard)
  async configure(@Body() req: ConfigureDto) {
    console.log('[intercom][configure]');
    return await this.intercomService.configure(
      req.workspaceId,
      req.inputValues
    );
  }

  @Post('canvas')
  @UseGuards(IntercomGuard)
  async canvas(@Body() body: CanvasBodyDto) {
    console.log('[intercom][canvas]');
    return await this.intercomService.canvas(body);
  }

  @Post('inbox/initialize')
  @UseGuards(IntercomGuard)
  async initializeInbox(@Body() req: InitializeInboxDto) {
    return await this.intercomService.initializeInbox(req);
  }

  @Post('conversation/submit')
  //@UseGuards(IntercomGuard)
  async submitConversation(@Body() body: SubmitBodyDto) {
    return await this.intercomService.submitConversation(body);
  }

  @Post('status')
  @UseGuards(IntercomGuard)
  async status(@Req() req: Request) {
    const workspaceId = req.body.workspace_id;
    return await this.intercomService.status(workspaceId);
  }
}
