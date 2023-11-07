import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../database/database.module';

import { AuthController } from './auth.controller';
import { IntercomAuthService } from './intercom/intercom-auth.service';
import { IntercomAuthStrategy } from './intercom/intercom-auth.strategy';
import { GoogleAuthService } from './google/google-auth.service';
import { GoogleAuthStrategy } from './google/google-auth.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { IntercomService } from '../intercom/intercom.service';
import { PostmarkController } from '../postmark/postmark.controller';
import { ClientRepository } from '../database/client/client.repository';
import { PostmarkService } from '../postmark/postmark.service';
import { AccountService } from '../account/account.service';
import { AccountModule } from '../account/account.module';
import { ApiService } from '../api/api.service';
import { SubscriptionService } from '../database/subscription/subscription.service';
import { CustomerMiddleware } from 'server/database/middlewares/customer.middleware';

@Module({
  imports: [AccountModule, DatabaseModule, PassportModule],
  controllers: [AuthController],
  providers: [
    AccountService,
    ApiService,
    IntercomService,
    IntercomAuthService,
    IntercomAuthStrategy,
    GoogleAuthService,
    GoogleAuthStrategy,
    AuthService,
    JwtStrategy,
    ClientRepository,
    PostmarkController,
    PostmarkService,
    SubscriptionService,
  ],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes('auth/*');
  }
}
