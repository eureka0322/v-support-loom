import { Test, TestingModule } from '@nestjs/testing';
import { IntercomController } from './intercom.controller';
import { IntercomService } from './intercom.service';
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
  let controller: IntercomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntercomController],
      providers: [
        AccountService,
        ApiService,
        AuthService,
        DatabaseService,
        IntercomService,
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

    controller = module.get<IntercomController>(IntercomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('submitConversation parses json body', async () => {
    const jsonBody = {
      linkId: '9e227122-7751-44c8-b0ac-dadb77ccd259',
      clientId: '72c2f14f-2046-4133-8754-639e2bb9c21d',
      customerId: '45a11b44-b995-4a07-b98d-ffc688726edc',
      recordingId: '44e10e23-a998-421b-8221-16bbbde284c4',
      recording: {
        thumbnailUrl:
          'https://res.cloudinary.com/videosupport-io/video/upload/q_50/v1641631191/undefined/undefined/blob-1641631191175.jpg',
        videoUrl:
          'https://res.cloudinary.com/videosupport-io/video/upload/q_80,vc_h264:main:3.1/v1641631191/undefined/undefined/blob-1641631191175.mp4',
        recordedAt: 1641631190436,
        isMuted: false,
        receiverEmail: '',
        message: '',
      },
      metadata: { postal_code: 9000, customer_support: true },
      reservedMetadata: {
        intercomAdminId: '5323787',
        intercomContactId: '60ef5c2f892d5b2639c205e0',
        intercomConversationId: '180117300000654',
      },
    };

    await controller.submitConversation(jsonBody);
  });
});
