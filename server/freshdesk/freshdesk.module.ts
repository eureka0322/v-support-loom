import { Module } from '@nestjs/common';
import { ApiService } from '../api/api.service';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from '../auth/auth.service';
import { FreshdeskController } from './freshdesk.controller';
import { FreshdeskService } from './freshdesk.service';
import { PostmarkService } from 'server/postmark/postmark.service';
import { ApiModule } from 'server/api/api.module';

@Module({
  imports: [ApiModule, DatabaseModule],
  controllers: [FreshdeskController],
  providers: [ApiService, AuthService, FreshdeskService, PostmarkService],
})
export class FreshdeskModule {}
