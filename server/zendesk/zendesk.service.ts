import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { DatabaseService } from '../database/database.service';
import { TicketSidebarDto } from './dtos/support-ticket-sidebar.dto';
import { AuthService } from '../auth/auth.service';
import { AccountService } from 'server/account/account.service';
import { v4 } from 'uuid';
import { Client } from '../database/client/client.model';

@Injectable()
export class ZendeskService {
  constructor(
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService
  ) {}

  async createClientAccount(subdomain: string) {
    return await this.accountService.createAccount({
      id: v4(),
      companyName: subdomain,
      plan: 'prepricing',
      integrations: {
        zendesk: {
          subdomain: subdomain,
        },
      },
      seats: 1,
      referrerUrl: 'https://videosupport.io',
      subscriptionType: 'trial',
    });
  }

  async frame(
    res: Response,
    query: TicketSidebarDto,
    subdomain: string,
    location: string,
    mode?: string
  ) {
    let existingClient = await this.databaseService.getClientByZendeskId(
      subdomain
    );
    let client: Client;
    if (existingClient === undefined) {
      // Create client
      client = await this.createClientAccount(subdomain);
    } else {
      client = existingClient.data;
    }

    const authorized = await this.accountService.verifyClient(client);
    if (authorized) {
      const payload = {
        clientId: client.id,
      };

      const jwt = await this.authService.signPayload(payload, 'member');
      let redirectUrl = `/zendesk/frame/${location}?token=${jwt}&origin=${query.origin}&app_guid=${query.app_guid}`;
      if (mode) redirectUrl = `${redirectUrl}&mode=${mode}`;
      res.redirect(redirectUrl);
    } else {
      res.redirect(
        `/zendesk/frame/end-of-trial?origin=${query.origin}&app_guid=${query.app_guid}`
      );
    }
  }
}
