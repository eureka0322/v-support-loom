import {
  Controller,
  Post,
  Get,
  Render,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';

import { ZendeskGuard } from '../guards/zendesk.guard';
import { ManifestService } from '../manifest/manifest.service';
import { ZendeskSubdomain } from './zendesk.decorator';
import { ZendeskService } from './zendesk.service';
import { TicketSidebarDto } from './dtos/support-ticket-sidebar.dto';
import { CheckUserDto } from './dtos/check-user.dto';

@Controller('zendesk')
export class ZendeskController {
  manifest: {
    script: any;
    css: any;
  };

  constructor(
    private readonly zendeskService: ZendeskService,
    readonly manifestService: ManifestService
  ) {
    this.manifest = {
      script: manifestService.get('zendesk'),
      css: manifestService.get('css'),
    };
  }

  @Post('chat/sidebar')
  @UseGuards(ZendeskGuard)
  async chatframe(
    @Res() res: Response,
    @Query() query: TicketSidebarDto,
    @ZendeskSubdomain() subdomain: string
  ) {
    await this.zendeskService.frame(
      res,
      query,
      subdomain,
      'ticket/sidebar',
      'chat'
    );
  }

  @Post('support/top-bar')
  @UseGuards(ZendeskGuard)
  async topBar(
    @Res() res: Response,
    @Query() query: TicketSidebarDto,
    @ZendeskSubdomain() subdomain: string
  ) {
    await this.zendeskService.frame(res, query, subdomain, 'top-bar');
  }

  @Post('support/background')
  @UseGuards(ZendeskGuard)
  async background(
    @Res() res: Response,
    @Query() query: TicketSidebarDto,
    @ZendeskSubdomain() subdomain: string
  ) {
    await this.zendeskService.frame(res, query, subdomain, 'background');
  }

  @Post('support/ticket/sidebar')
  @UseGuards(ZendeskGuard)
  async ticketframe(
    @Res() res: Response,
    @Query() query: TicketSidebarDto,
    @ZendeskSubdomain() subdomain: string
  ) {
    await this.zendeskService.frame(
      res,
      query,
      subdomain,
      'ticket/sidebar',
      'ticket'
    );
  }

  @Post('support/new_ticket/sidebar')
  @UseGuards(ZendeskGuard)
  async newTicketframe(
    @Res() res: Response,
    @Query() query: TicketSidebarDto,
    @ZendeskSubdomain() subdomain: string
  ) {
    await this.zendeskService.frame(
      res,
      query,
      subdomain,
      'ticket/sidebar',
      'ticket'
    );
  }

  @Get('user/check')
  @UseGuards(ZendeskGuard)
  async checkUser(
    @Query() query: CheckUserDto,
    @ZendeskSubdomain() subdomain: string
  ) {}

  //-----------------
  // Frames
  //-----------------
  @Get('frame/background')
  @Render('page')
  async frameBackground() {
    return this.manifest;
  }
  @Get('frame/ticket/sidebar')
  @Render('page')
  async frameTicketframe() {
    return this.manifest;
  }
  @Get('frame/top-bar')
  @Render('page')
  async frameTopBar() {
    return this.manifest;
  }
  @Get('frame/out-of-seats')
  @Render('page')
  async frameOuOfSeats() {
    return this.manifest;
  }
  @Get('frame/end-of-trial')
  @Render('page')
  async frameEndOfTrial() {
    return this.manifest;
  }
}
