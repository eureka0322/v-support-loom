import { Global, Module } from '@nestjs/common';
import { ApiModule } from 'server/api/api.module';
import { ApiService } from 'server/api/api.service';
import { AuthService } from 'server/auth/auth.service';
import { DatabaseModule } from 'server/database/database.module';
import { DatabaseService } from 'server/database/database.service';
import { RequestAccessRepository } from 'server/database/request-access/request-access.repository';
import { PostmarkService } from 'server/postmark/postmark.service';
import { NotificationsGateway } from './notifications.gateway';

@Global()
@Module({
  imports: [ApiModule, DatabaseModule],
  providers: [
    ApiService,
    AuthService,
    RequestAccessRepository,
    DatabaseService,
    NotificationsGateway,
    PostmarkService,
  ],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
