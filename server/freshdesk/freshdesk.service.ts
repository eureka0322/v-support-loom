import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FreshdeskService {
  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService
  ) {}

  authenticate(clientId: string) {
    const payload = { clientId };
    return this.authService.signPayload(payload, 'member');
  }

  async requestVideo(clientId: string) {
    console.log(clientId);
    const client = await this.databaseService.getClientByClientId(clientId);
    if (client) {
      const link = await this.apiService.createLinkRequest({}, client.data);
      // TODO
      // send link to chat
    } else {
      throw new BadRequestException(`Unknown client ID: ${clientId}`);
    }
  }
}
