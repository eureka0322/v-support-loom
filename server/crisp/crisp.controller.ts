import {
  Controller,
  Get,
  Query,
  Render,
  Res,
  Post,
  UseGuards,
  Body,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from '../roles/roles.decorator';
import { ClientId } from '../api/api.decorator';
import { ClientGuard } from '../guards/client.guard';
import { ManifestService } from '../manifest/manifest.service';

import { CrispService } from './crisp.service';
import { RolesGuard } from '../guards/roles.guard';
import { HookPayloadDto } from 'server/api/dtos/hook-payload.dto';
import { DatabaseService } from '../database/database.service';

import { getEnv } from '../utils';
const env = getEnv();

// Controller: Part of a Module
@Controller('crisp')
export class CrispController {
  // ts doesn't find some functions, so we use any here
  client: any;
  manifest: {
    script: any;
    css: any;
  };

  constructor(
    readonly crispService: CrispService,
    private readonly databaseService: DatabaseService,
    readonly manifestService: ManifestService
  ) {
    this.manifest = {
      script: manifestService.get('crisp'),
      css: manifestService.get('css'),
    };
  }

  @Get('configure')
  async configure(
    @Query('website_id') websiteId: string,
    @Query('token') token: string,
    @Query('locale') locale: string
  ) {
    return await this.crispService.configureCrisp(websiteId, token, locale);
  }
  @Get('install')
  async install(
    @Query('website_id') websiteId: string,
    @Query('token') token: string,
    @Res() res: Response
  ) {
    await this.crispService.installCrisp(websiteId, token);
    res.redirect('https://app.crisp.chat/');
  }

  @Get('widget')
  async widget(
    @Query('website_id') websiteId: string,
    @Query('token') token: string,
    @Query('locale') locale: string,
    @Query('crisp_email') crisp_email: string,
    @Res() res: Response
  ) {
    await this.crispService.sidebar(websiteId, token, res, crisp_email);
  }

  @Post('send-link')
  @Roles('admin', 'member')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async sendLink(
    @ClientId() clientId: string,
    @Body() body: { sessionId: string; customer: any }
  ) {
      await this.crispService.sendLink(clientId, body.sessionId, body.customer);
  }

  @Post('count-request-send-link')
  @Roles('admin', 'member')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async countRequestSendLink(
    @ClientId() clientId: string,
    //@Body() body: { sessionId: string; customer: any, crisp_email: string; }
    @Body() { sessionId, customer, crisp_email }: { sessionId: string; customer: any; crisp_email:string}
  ) {
    var user_subscription = await this.databaseService.getOrganizationSubscriptionCrisp(clientId);

    console.log('user_subscription = ', user_subscription)
    if(user_subscription) {

      var planExpirationDate = user_subscription.expirationDate
      console.log('planExpirationDate = ', planExpirationDate)
      if(planExpirationDate != undefined) {

        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        var currentDate = `${month}/${day}/${year}`;

        var date1 = new Date(planExpirationDate);
        var date2 = new Date(currentDate);

        if(date2 > date1) {
          console.log('planExpired')
          return 'plan_expired'
        } else {
          console.log('not planExpired')
        }
      }
    }

    var user_data = await this.databaseService.getUserByEmail(crisp_email);

    if(user_data && user_data.data.hasSeat === false) {
      return 'no_seat'
    }

    if(user_subscription) {

      var subsc_name = user_subscription.name;

      if(subsc_name != 'Trial') {
        return true;
      } else {
        console.log('user_subscription is trial');
        return await this.subscriptionCheck(clientId);
      }

    } else {
        console.log('user has no subscription ');
        return await this.subscriptionCheck(clientId);
    }
  }

  async subscriptionCheck(clientId:string) {

    var recording_data = await this.crispService.countRequestSendLink(clientId);
    var link_send_free_limit = Number(process.env.LINK_SEND_FREE_LIMIT);

    if(recording_data != undefined) {

      console.log('recording_data = ', recording_data);
      console.log('recording_data = ', recording_data.length);

      if(recording_data.length < link_send_free_limit) {
        return true
      } else {
        return false
      }
    }
  }

  @Post('video-to-chat-hook')
  @Roles('vs-hooks')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async sendVideoToChatHook(@Body() body: HookPayloadDto) {
    await this.crispService.sendVideoToChatHook(
      body.clientId,
      body.reservedMetadata.crispSessionId,
      body.recordingId
    );
  }

  @Get('button')
  async button() {}
  //-----------------
  // Frames
  //-----------------
  @Get('frame/chat')
  @Render('page')
  async frameChat() {
    return this.manifest;
  }
  @Get('frame/out-of-seats')
  @Render('page')
  async frameOutOfSeats() {
    return this.manifest;
  }

  @Get('frame/end-of-trial')
  @Render('page')
  async frameEndOfTrial() {
    return this.manifest;
  }
}
