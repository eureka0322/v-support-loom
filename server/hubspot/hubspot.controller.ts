import * as hubspot from '@hubspot/api-client';

import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { HubspotOauthDto } from './dtos/hubspot-oauth.dto';
import { baseUrl } from '../utils';
import { HubspotService } from './hubspot.service';
import { HubspotCrmContactFetchDto } from './dtos/hubspot-crm-contact-fetch.dto';
import { Response } from 'express';
import { HubspotCrmTicketFetchDto } from './dtos/hubspot-crm-ticket-fetch.dto';
import { RegisterTicketDto } from './dtos/hubspot-register-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { ManifestService } from '../manifest/manifest.service';
import { Request } from 'express';
import { HubSpotGuard } from 'server/guards/hubspot.guard';

@Controller('hubspot')
export class HubspotController {
  manifest: {
    script: any;
    css: any;
  };

  constructor(
    private readonly hubspotService: HubspotService,
    readonly manifestService: ManifestService
  ) {
    this.manifest = {
      script: manifestService.get('hsframe'),
      css: manifestService.get('css'),
    };
  }

  @Get('/request')
  @Render('page')
  async contactRequestLink() {
    return this.manifest;
  }

  @Get('/out-of-seats')
  @Render('page')
  async outOfseatsLink() {
    return this.manifest;
  }

  @Get('/end-of-trial')
  @Render('page')
  async endOfTrialLink() {
    return this.manifest;
  }

  @Post('hooks/timeline/add')
  @UseGuards(HubSpotGuard)
  async addRecordingToTimeline(@Body() body: any) {}

  @Post('hooks/chat/ticket/update')
  @UseGuards(HubSpotGuard)
  async updateTicket(@Body() body: UpdateTicketDto) {
    console.log('[updateTicket]');
    await this.hubspotService.updateTicketHook(
      parseInt(body.metadata.hubspotId),
      body.recordingId,
      body.metadata.hubspotConversationId
    );
  }

  @Post('hooks/chat/ticket/register')
  @UseGuards(HubSpotGuard)
  async registerTicket(@Body() body: RegisterTicketDto) {
    await this.hubspotService.registerTicket(
      body.portalId,
      body.properties.hs_thread_id.value,
      body.properties.hs_ticket_id_to_restore.value
    );
  }

  @Post('hooks/chat/start')
  @UseGuards(HubSpotGuard)
  @HttpCode(200)
  // TODO(Joao): change for dto
  async startChat(@Body() body: any) {
    //HubspotChatCreateLinkDto) {
    return this.hubspotService.startChat(body);
  }

  @Get('crm/contacts/fetch')
  @UseGuards(HubSpotGuard)
  async dataFetchCrmCardContact(@Query() query: HubspotCrmContactFetchDto) {
    return this.hubspotService.fetchCrmCardContact(
      parseInt(query.portalId),
      query.firstname,
      query.email,
      query.userEmail
    );
  }

  @Get('crm/tickets/fetch')
  @UseGuards(HubSpotGuard)
  async dataFetchCrmCardTicket(@Query() query: HubspotCrmTicketFetchDto) {
    return this.hubspotService.fetchCrmCardTicket(
      parseInt(query.portalId),
      query.ticketId
    );
  }

  @Get('oauth-callback')
  async oauthCallback(
    @Req() req: Request,
    @Query() query: HubspotOauthDto,
    @Res() res: Response
  ) {
    try {
      await this.hubspotService.createOrUpdateClient(query);
    } catch (err) {
      console.log(err);
      return {
        url: baseUrl('404'),
      };
    }
    const referer = req.headers.referer;
    if (referer === undefined) {
      res.redirect('https://hubspot.com');
    } else {
      res.redirect(referer);
    }
  }
}
