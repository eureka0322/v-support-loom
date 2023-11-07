import { Test, TestingModule } from '@nestjs/testing';
import { HubspotService } from './hubspot.service';
import { ApiModule } from '../api/api.module';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { AccountService } from '../account/account.service';
import { AccountModule } from '../account/account.module';
import { PostmarkService } from '../postmark/postmark.service';
import { PostmarkModule } from '../postmark/postmark.module';

describe('HubspotService', () => {
  let service: HubspotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        ApiService,
        AuthService,
        DatabaseService,
        HubspotService,
        PostmarkService,
      ],
      imports: [AccountModule, ApiModule, DatabaseModule, PostmarkModule],
    }).compile();

    service = module.get<HubspotService>(HubspotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
