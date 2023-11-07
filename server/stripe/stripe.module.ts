import { Module, MiddlewareConsumer } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { ManifestService } from '../manifest/manifest.service';
import { RecordingRepository } from '../database/recordings/recording.repository';
import { DatabaseService } from '../database/database.service';
import { AuthService } from '../auth/auth.service';
import { RequestAccessRepository } from '../database/request-access/request-access.repository';
import { AccountService } from '../account/account.service';
import { SubscriptionService } from '../database/subscription/subscription.service';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [StripeController],
  providers: [
    AuthService,
    DatabaseService,
    RequestAccessRepository,
    StripeService,
  ],
})
export class StripeModule {}
