import { Module, MiddlewareConsumer } from '@nestjs/common';
import { join } from 'path';

import { DatabaseRepository } from './database.repository';
import { DatabaseConnection } from './database.connection';
import { DatabaseController } from './database.controller';

import { RecordingRepository } from '../database/recordings/recording.repository';

import { MulterModule } from '@nestjs/platform-express';
import { WorkspaceRepository } from './workspaces/workspace.repository';
import { UsersRepository } from './users/users.repository';
import { PotentialUsersRepository } from './users/potential-users.repository';
import { ClientRepository } from './client/client.repository';
import { PricingRepository } from './pricing/pricing.repository';
import { IntercomRepository } from '../intercom/intercom.repository';
import { FeedbackRepository } from './feedback/feedback.repository';
import { ButtonRepository } from './button/button.repository';
import { ROICalculatorRepository } from './roicalculator/roicalculator.repository';
import { CustomerMiddleware } from './middlewares/customer.middleware';
import { DatabaseService } from './database.service';
import { IntegrationMiddleware } from './middlewares/integration.middleware';
import { HubspotRepository } from './hubspot/hubspot.repository';
import { ApiLinkRepository } from './api_link/api-link.repository';
import { ConfigService } from '../config/config.service';
import { AuthService } from '../auth/auth.service';
import { RequestAccessRepository } from './request-access/request-access.repository';
import {
  SubscriptionRepository,
  SubscriptionTypeRepository,
} from './subscription/subscription.repository';
import { SlackRepository } from './slack/slack.repository';
import { SignupSessionRepository } from './signup-session/signup-session.repository';
import { PluginsRepository } from './plugins/plugins.repository';

@Module({
  imports: [
    MulterModule.register({ dest: join(__dirname, '../../public/uploads') }),
  ],
  controllers: [DatabaseController],
  providers: [
    AuthService,
    ApiLinkRepository,
    ConfigService,
    DatabaseConnection,
    DatabaseService,
    DatabaseRepository,
    RecordingRepository,
    WorkspaceRepository,
    UsersRepository,
    ClientRepository,
    IntercomRepository,
    PricingRepository,
    FeedbackRepository,
    ButtonRepository,
    ROICalculatorRepository,
    RequestAccessRepository,
    SubscriptionRepository,
    SubscriptionTypeRepository,
    PotentialUsersRepository,
    HubspotRepository,
    SlackRepository,
    SignupSessionRepository,
    PluginsRepository,
  ],
  exports: [
    ApiLinkRepository,
    DatabaseConnection,
    DatabaseService,
    DatabaseRepository,
    RecordingRepository,
    UsersRepository,
    ClientRepository,
    WorkspaceRepository,
    IntercomRepository,
    FeedbackRepository,
    PotentialUsersRepository,
    PricingRepository,
    SubscriptionRepository,
    SubscriptionTypeRepository,
    HubspotRepository,
    SlackRepository,
    SignupSessionRepository,
    PluginsRepository,
  ],
})
export class DatabaseModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes('db/*');
    consumer.apply(IntegrationMiddleware).forRoutes('db/*');
  }
}
