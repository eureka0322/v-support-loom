import { Test, TestingModule } from '@nestjs/testing';
import { HubspotController } from './hubspot.controller';
import { HubspotService } from './hubspot.service';
import { ApiModule } from '../api/api.module';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { ManifestService } from '../manifest/manifest.service';
import { ManifestModule } from '../manifest/manifest.module';
import { AccountService } from '../account/account.service';
import { AccountModule } from '../account/account.module';
import { PostmarkService } from '../postmark/postmark.service';
import { PostmarkModule } from '../postmark/postmark.module';

describe('HubspotController', () => {
  let controller: HubspotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubspotController],
      providers: [
        AccountService,
        ApiService,
        AuthService,
        DatabaseService,
        HubspotService,
        ManifestService,
        PostmarkService,
      ],
      imports: [
        AccountModule,
        DatabaseModule,
        ApiModule,
        ManifestModule,
        PostmarkModule,
      ],
    }).compile();

    controller = module.get<HubspotController>(HubspotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
