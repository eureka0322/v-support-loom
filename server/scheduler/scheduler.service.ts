import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from 'server/config/config.service';
import { DatabaseService } from 'server/database/database.service';

import { IntercomService } from 'server/intercom/intercom.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly intercomService: IntercomService
  ) {}
  @Interval(600000)
  async handleInterval() {
    const clients = await this.databaseService.getAllIntercomClients();
    let success = 0;
    for (const client of clients) {
      const clientId: string = client.clientId as string;
      try {
        await this.intercomService.addAllAdmins(
          clientId,
          client.workspaceId,
          client.accessToken,
          true
        );
        success += 1;
      } catch (e) {}
    }
    console.log(
      `Updated ${success}/${clients.length} intercom users successfully`
    );
  }
}
