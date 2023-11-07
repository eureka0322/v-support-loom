import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { IntercomModule } from './intercom.module';
import { IntercomService } from './intercom.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('Intercom-e2e', () => {
  let app: INestApplication;
  let intercomService = {
    status: async () => {},
    submitConversation: async () => {},
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [IntercomModule],
    })
      .overrideProvider(IntercomService)
      .useValue(intercomService)
      .compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  test('/POST status', () => {
    return request(app.getHttpServer()).post('/intercom/status').expect(201);
  });

  test('/POST conversation/submit 201', () => {
    const jsonBody = {
      linkId: '90e66c29-ddcf-4f0b-bf95-b866035b3899',
      clientId: '0177519d-b9ab-4df1-a1b3-153e1ce5d4e5',
      customerId: '45a11b44-b995-4a07-b98d-ffc688726edc',
      recordingId: '3a75c850-d161-48e3-b2d1-19bea9255752',
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
        intercomConversationId: 180117300000654,
      },
    };

    return request(app.getHttpServer())
      .post('/intercom/conversation/submit')
      .send(jsonBody)
      .expect(201);
  });

  test('/POST conversation/submit 400', () => {
    // Missing payload returns 400

    return request(app.getHttpServer())
      .post('/intercom/conversation/submit')
      .expect(400);
  });

  test('/POST conversation/submit 400', () => {
    // Bad payload (missing linkId) returns 400
    const jsonBody = {
      clientId: '0177519d-b9ab-4df1-a1b3-153e1ce5d4e5',
      customerId: '45a11b44-b995-4a07-b98d-ffc688726edc',
      recordingId: '3a75c850-d161-48e3-b2d1-19bea9255752',
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
        intercomConversationId: 180117300000654,
      },
    };

    return request(app.getHttpServer())
      .post('/intercom/conversation/submit')
      .send(jsonBody)
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
