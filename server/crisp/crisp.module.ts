import { Module, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AccountService } from '../account/account.service';
import { AuthService } from '../auth/auth.service';

import { CrispController } from './crisp.controller';
import { CrispService } from './crisp.service';
import { SubscriptionService } from '../database/subscription/subscription.service';
import { RequestAccessRepository } from '../database/request-access/request-access.repository';
import { SubscriptionRepository } from '../database/subscription/subscription.repository';
import { DatabaseModule } from '../database/database.module';
import { ManifestService } from '../manifest/manifest.service';
import { ApiMiddleware } from '../api/api.middleware';
import { ApiService } from '../api/api.service';
import { PostmarkService } from '../postmark/postmark.service';
import { ApiModule } from 'server/api/api.module';

@Module({
  imports: [ApiModule, DatabaseModule],
  controllers: [CrispController],
  providers: [
    AccountService,
    ApiService,
    AuthService,
    CrispService,
    DatabaseService,
    ManifestService,
    PostmarkService,
    RequestAccessRepository,
    SubscriptionService,
    SubscriptionRepository,
  ],
})
export class CrispModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes('crisp/send-link');
  }
}
