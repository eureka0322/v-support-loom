import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { VideosupportAppModule } from './videosupport/videosupportapp.module';
import { AccountModule } from './account/account.module';
import { IntercomModule } from './intercom/intercom.module';
import { PostmarkModule } from './postmark/postmark.module';
import { ZendeskModule } from './zendesk/zendesk.module';
import { BaseModule } from './base/base.module';
import { HubspotModule } from './hubspot/hubspot.module';
import { ApiModule } from './api/api.module';
import { CrispModule } from './crisp/crisp.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FreshdeskModule } from './freshdesk/freshdesk.module';
import { SlackModule } from './slack/slack.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ApiModule,
    BaseModule,
    ConfigModule,
    CrispModule,
    FreshdeskModule,
    AuthModule,
    VideosupportAppModule,
    AccountModule,
    NotificationsModule,
    IntercomModule,
    ZendeskModule,
    PostmarkModule,
    HubspotModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
    SlackModule,
    StripeModule,
  ],
})
export class AppModule {}
