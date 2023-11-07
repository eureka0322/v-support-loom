import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { PostmarkModule } from '../postmark/postmark.module';
import { PostmarkService } from '../postmark/postmark.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiService, AuthService, DatabaseService, PostmarkService],
      imports: [AuthModule, ConfigModule, DatabaseModule, PostmarkModule],
    }).compile();

    service = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
