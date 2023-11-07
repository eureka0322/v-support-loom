import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ConfigModule } from '../config/config.module';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { PostmarkModule } from '../postmark/postmark.module';
import { PostmarkService } from '../postmark/postmark.service';
import { RequestAccessRepository } from '../database/request-access/request-access.repository';
import { ApiMiddleware } from './api.middleware';
import { RolesMiddleware } from '../roles/roles.middleware';

@Module({
  imports: [AuthModule, ConfigModule, DatabaseModule, PostmarkModule],
  controllers: [ApiController],
  providers: [
    ApiService,
    AuthService,
    DatabaseService,
    PostmarkService,
    RequestAccessRepository,
  ],
  exports: [ApiService],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes('*');
    consumer.apply(RolesMiddleware).forRoutes('*');
  }
}
