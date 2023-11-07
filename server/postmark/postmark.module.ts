import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

import { PostmarkController } from './postmark.controller';
import { PostmarkService } from './postmark.service';

// Module: Collection of a Functionality

@Module({
  imports: [ConfigModule],
  controllers: [PostmarkController],
  providers: [PostmarkService, ConfigService],
})
export class PostmarkModule {}
