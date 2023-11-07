import { Module } from '@nestjs/common';

import { ManifestModule } from '../manifest/manifest.module';

import { VideosupportAppController } from './videosupportapp.controller';

@Module({
  imports: [ManifestModule],
  controllers: [VideosupportAppController],
})
export class VideosupportAppModule {}
