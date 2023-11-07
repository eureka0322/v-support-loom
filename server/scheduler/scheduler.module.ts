import { Module } from '@nestjs/common';
import { ApiModule } from 'server/api/api.module';
import { AccountService } from '../account/account.service';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { RequestAccessRepository } from '../database/request-access/request-access.repository';
import { SubscriptionService } from '../database/subscription/subscription.service';
import { IntercomService } from '../intercom/intercom.service';
import { PostmarkService } from '../postmark/postmark.service';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ApiModule, DatabaseModule],
  providers: [
    AccountService,
    AuthService,
    ApiService,
    DatabaseService,
    IntercomService,
    PostmarkService,
    RequestAccessRepository,
    SchedulerService,
    SubscriptionService,
  ],
})
export class SchedulerModule {}
