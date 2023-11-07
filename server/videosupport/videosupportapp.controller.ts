import { Controller, Get, Render } from '@nestjs/common';

import { baseUrl } from '../utils';

import { ManifestService } from '../manifest/manifest.service';

console.log('[videosupport.controller]', baseUrl());
@Controller('v')
export class VideosupportAppController {
  constructor(private readonly manifestService: ManifestService) {}

  private getTemplateVars() {
    return {
      script: this.manifestService.get('videosupport'),
      css: this.manifestService.get('css'),
    };
  }

  @Get('/')
  @Render('page')
  getAppRoot() {
    return this.getTemplateVars();
  }

  @Get('record/?*')
  @Render('page')
  getAppRecord() {
    return this.getTemplateVars();
  }

  @Get('complete/?*')
  @Render('page')
  getAppComplete() {
    return this.getTemplateVars();
  }

  @Get('404')
  @Render('page')
  get404() {
    return this.getTemplateVars();
  }
}
