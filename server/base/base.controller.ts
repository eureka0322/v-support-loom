import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { baseUrl } from 'server/utils';

import { ManifestService } from '../manifest/manifest.service';

console.log('[base.controller]');
@Controller('')
export class BaseController {
  constructor(private readonly manifestService: ManifestService) {}

  private getTemplateVars() {
    return {
      script: this.manifestService.get('base'),
      css: this.manifestService.get('css'),
    };
  }

  @Get('/')
  getApp(@Res() res: Response) {
    res.redirect(baseUrl('account/login'));
  }

  @Get('menu/?*')
  @Render('page')
  getAppMenu() {
    return this.getTemplateVars();
  }

  @Get('demo')
  @Render('page')
  getDemo() {
    return this.getTemplateVars();
  }

  @Get('crisp-demo')
  @Render('page')
  getCrispDemo() {
    return this.getTemplateVars();
  }

  @Get('recording/?*')
  @Render('page')
  getAppRecording() {
    return this.getTemplateVars();
  }

  @Get('thank-you')
  @Render('page')
  getThankYou() {
    return this.getTemplateVars();
  }
  @Get('my-videos')
  @Render('page')
  getMyVideos() {
    return this.getTemplateVars();
  }
  @Get('my-team')
  @Render('page')
  getMyTeam() {
    return this.getTemplateVars();
  }
  @Get('getting-started')
  @Render('page')
  getGettingStarted() {
    return this.getTemplateVars();
  }
  @Get('record')
  @Render('page')
  getRecord() {
    return this.getTemplateVars();
  }

  @Get('401')
  @Render('page')
  get401() {
    return this.getTemplateVars();
  }

  @Get('404')
  @Render('page')
  get404() {
    return this.getTemplateVars();
  }
}
