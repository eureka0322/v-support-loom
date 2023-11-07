import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigService } from '../config/config.service';
import axios from 'axios';
import { v4 } from 'uuid';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, DatabaseService],
      imports: [DatabaseModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('signed put', async () => {
    const signedPut = await service.presignedS3Put(v4());
    await axios
      .put(signedPut, v4())
      .then((response) => {
        expect(response.status).toBe(200);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  test('signed get', async () => {
    const name = v4();
    const content = v4();
    const signedPut = await service.presignedS3Put(name);
    const signedGet = await service.presignedS3Get(name);
    await axios.put(signedPut, content);
    await axios.get(signedGet).then((response) => {
      expect(response.data).toBe(content);
    });
  });
});
