import { Module } from '@nestjs/common';

import { ManifestModule } from '../manifest/manifest.module';

import { BaseController } from './base.controller';

@Module({
  imports: [ManifestModule],
  controllers: [BaseController],
})
export class BaseModule {}
