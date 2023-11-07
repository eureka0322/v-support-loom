import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { Client } from '../database/client/client.model';
import { v4 } from 'uuid';
import { ApiRequestLinkDto } from './dtos/link-request.dto';
import { PostmarkModule } from '../postmark/postmark.module';
import { PostmarkService } from '../postmark/postmark.service';

describe('ApiController', () => {
  let controller: ApiController;
  let testClient: Client;
  let database: DatabaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService, AuthService, DatabaseService, PostmarkService],
      imports: [AuthModule, ConfigModule, DatabaseModule, PostmarkModule],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    database = module.get<DatabaseService>(DatabaseService);
    testClient = new Client(
      v4(),
      'jest-test-client',
      {},
      'prepricing',
      0,
      new Date(),
      'trial'
    );
    await database.createClient(testClient);
  });

  afterAll(async () => {
    // destroy client from database
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('client should exist', () => {
    expect(testClient).toBeDefined();
  });

  test('creates a link', async () => {
    const request = new ApiRequestLinkDto();
    request.clientId = testClient.id;
    const link = await controller.createLinkRequest(request);
    expect(link).toBeDefined();
    // TODO(Joao): check jwt is valid (passes auth check)
  });
});
