import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ManifestModule } from '../manifest/manifest.module';
import { ManifestService } from '../manifest/manifest.service';
import { ApiModule } from '../api/api.module';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { HubspotController } from './hubspot.controller';
import { HubspotService } from './hubspot.service';
import { PostmarkService } from '../postmark/postmark.service';
import { PostmarkModule } from '../postmark/postmark.module';
import { AccountModule } from '../account/account.module';
import { AccountService } from '../account/account.service';
import { RequestAccessRepository } from '../database/request-access/request-access.repository';
import { SubscriptionService } from '../database/subscription/subscription.service';

@Module({
  controllers: [HubspotController],
  providers: [
    AccountService,
    ApiService,
    AuthService,
    DatabaseService,
    HubspotService,
    ManifestService,
    PostmarkService,
    RequestAccessRepository,
    SubscriptionService,
  ],
  imports: [
    AccountModule,
    ApiModule,
    AuthModule,
    DatabaseModule,
    ManifestModule,
    PostmarkModule,
  ],
})
export class HubspotModule {}
