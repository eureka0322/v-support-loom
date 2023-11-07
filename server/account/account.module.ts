import { Module } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';

import { ManifestModule } from '../manifest/manifest.module';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthService } from '../auth/auth.service';
import { SubscriptionService } from '../database/subscription/subscription.service';
import { RequestAccessRepository } from '../database/request-access/request-access.repository';
import { PostmarkService } from 'server/postmark/postmark.service';

@Module({
  imports: [ManifestModule, DatabaseModule],
  controllers: [AccountController],
  providers: [
    AccountService,
    AuthService,
    DatabaseService,
    PostmarkService,
    RequestAccessRepository,
    SubscriptionService,
  ],
})
export class AccountModule {}
