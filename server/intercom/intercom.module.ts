import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { ApiService } from '../api/api.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { PostmarkModule } from '../postmark/postmark.module';
import { PostmarkService } from '../postmark/postmark.service';
import { AccountModule } from '../account/account.module';
import { AccountService } from '../account/account.service';

import { DatabaseModule } from '../database/database.module';

import { IntercomController } from './intercom.controller';
import { IntercomService } from './intercom.service';
import { SubscriptionService } from '../database/subscription/subscription.service';

@Module({
  imports: [
    AccountModule,
    ApiModule,
    AuthModule,
    DatabaseModule,
    PostmarkModule,
  ],
  controllers: [IntercomController],
  providers: [
    AccountService,
    ApiService,
    AuthService,
    IntercomService,
    PostmarkService,
    SubscriptionService,
  ],
})
export class IntercomModule {}
