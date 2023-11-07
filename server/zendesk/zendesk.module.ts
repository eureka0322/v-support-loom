import { Module, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { ZendeskController } from './zendesk.controller';
import { ZendeskService } from './zendesk.service';
import { ManifestService } from '../manifest/manifest.service';
import { ZendeskMiddleware } from './zendesk.middleware';
import { RecordingRepository } from '../database/recordings/recording.repository';
import { DatabaseService } from '../database/database.service';
import { AuthService } from '../auth/auth.service';
import { RequestAccessRepository } from '../database/request-access/request-access.repository';
import { AccountService } from '../account/account.service';
import { SubscriptionService } from '../database/subscription/subscription.service';
import { PostmarkService } from 'server/postmark/postmark.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ZendeskController],
  providers: [
    AccountService,
    AuthService,
    DatabaseService,
    ManifestService,
    PostmarkService,
    RecordingRepository,
    RequestAccessRepository,
    SubscriptionService,
    ZendeskService,
  ],
})
export class ZendeskModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ZendeskMiddleware).forRoutes('zendesk/*');
  }
}
