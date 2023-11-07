import { Injectable } from '@nestjs/common';
import { Crisp } from 'crisp-api';
import { v4 } from 'uuid';
import { Response } from 'express';

import { DatabaseService } from '../database/database.service';
import { AuthService } from '../auth/auth.service';
import { AccountService } from 'server/account/account.service';
import { User as UserModel } from '../database/users/users.model';
import { baseUrl } from '../utils';
import { Client } from '../database/client/client.model';
import { ApiService } from '../api/api.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class CrispService {
  client: any;

  constructor(
    private readonly apiService: ApiService,
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    configService: ConfigService
  ) {
    this.client = new Crisp();
    const crispId = configService.getString('CRISP_ID', false);
    const crispSecret = configService.getString('CRISP_SECRET', false);
    this.client.authenticateTier('plugin', crispId, crispSecret);
  }

  async addOperators(clientId: string, operators: any[]) {
    for (const operator of operators) {
      console.log('-----------------------------')
      console.log('clientId = ', clientId)
      console.log('operator = ', operator)
      const userInDb = await this.databaseService.getUserByEmail(
        operator.details.email
      );
      console.log('userInDb = ', userInDb)
      if (operator.type === 'operator' && userInDb === undefined) {
        const name =
          operator.details.first_name + ' ' + operator.details.last_name;

        const organizationRole =
          operator.details.role === 'owner' ? 'admin' : 'member';
          console.log('operator.details.email= ', operator.details.email)

        const photo = '';
        //const hasSeat = true;
        /* on intallation only admin seat is approved, admin will give the seat to member from website. */
        var hasSeat = false;
        if(organizationRole == 'admin') {
          hasSeat = true;
        }

        await this.databaseService.createUser(
          new UserModel(
            v4(),
            name,
            operator.details.email,
            photo,
            clientId,
            organizationRole,
            hasSeat
          )
        );
        console.log('user created')
      } else {
        console.log('user already exist')
      }
    }
  }

  async configureCrisp(websiteId: string, token: string, locale: string) {
    return 'ok';
  }

  async newCrispCompany(websiteId: string) {
    const website = await this.client.website.getWebsite(websiteId);
    const companyName = website.name;
    const subscriptionType = 'trial';
    const plan = 'prepricing';
    const operators = await this.client.website.listWebsiteOperators(websiteId);
    console.log('website operators = ', operators)
    const seats = operators.length;
    const referrerUrl = 'https://videosupport.io';
    const integrations = {
      crisp: {
        websiteId: websiteId,
      },
    };

    const id = v4();

    const client = await this.accountService.createAccount({
      id,
      companyName,
      plan,
      integrations,
      seats,
      referrerUrl,
      subscriptionType,
    });
    await this.addOperators(id, operators);

    return client;
  }

  async installCrisp(websiteId: string, token: string) {
    // add to db, if not already
    console.log('websiteId = ', websiteId)
    try {
      const client = await this.databaseService.getClientByCrispId(websiteId);

      console.log('Crisp plugin already installed = ', client)

      if (client === undefined) {
        await this.newCrispCompany(websiteId);
      }
    } catch(error) {
      console.log('installCrisp error = ', error)
    }
  }

  async countRequestSendLink(clientId: string) {
    return await this.databaseService.countRequestSendLink(clientId);
  }

  async sendLink(clientId: string, sessionId: string, customer: any) {
    try {
      const client = await this.databaseService.getClientByClientId(clientId);
      if (client === undefined) {
        // error
      } else {
        const data = client.data;
        const request = {
          customer,
          reservedMetadata: {
            crispSessionId: sessionId,
          },
          postRecordHooks: [
            {
              name: 'Send video to Crisp chat',
              url: baseUrl('/crisp/video-to-chat-hook'),
            },
          ],
          options: {
            tinyUrl: true,
          },
        };
        const res = await this.apiService.createLinkRequest(request, data);
        await this.client.website
          .sendMessageInConversation(
            data.settings.integrations.crisp.websiteId,
            sessionId,
            {
              type: 'text',
              from: 'operator',
              origin: 'chat',
              content: `[Click here](${res}) to record a video of your issue`,
            }
          )
          .catch((error: any) => {
            console.error("Crisp couldn't send link message");
            console.error(error);
          });
      }
    } catch(error) {
      console.log('sendLink = ', error);
    }
  }

  async sendVideoToChatHook(
    clientId: string,
    sessionId: string,
    recordingId: string
  ) {
    const client = await this.databaseService.getClientByClientId(clientId);
    if (client === undefined) {
      // error
    } else {
      const recording = await this.databaseService.getRecordingByUuid(
        recordingId
      );
      const supportUrl = baseUrl(`/recording/${recordingId}?type=support`);
      const customerUrl = baseUrl(`/recording/${recordingId}?type=customer`);
      const data = client.data;
      this.client.website
        .sendMessageInConversation(
          data.settings.integrations.crisp.websiteId,
          sessionId,
          {
            type: 'text',
            from: 'user',
            origin: 'chat',
            content: `I just recorded a video. [Click here](${customerUrl}) to watch`,
          }
        )
        .catch((error: any) => {
          console.error("Crisp couldn't send video message");
          console.error(error);
        });

      let supportMessage = `Customer just recorded a video. [Click here](${supportUrl}) to watch`;
      if (recording?.data && recording.data.recording.message !== '') {
        supportMessage = `${supportMessage}
        Message: *${recording.data.recording.message}*`;
      }
      this.client.website
        .sendMessageInConversation(
          data.settings.integrations.crisp.websiteId,
          sessionId,
          {
            type: 'note',
            from: 'operator',
            origin: 'chat',
            content: supportMessage,
          }
        )
        .catch((error: any) => {
          console.error("Crisp couldn't send video message");
          console.error(error);
        });
    }
  }

  async rightbar(websiteId: string, website_number: number) {

  }


  async sidebar(websiteId: string, token: string, res: Response, crisp_email: string) {
    console.log('crisp sidebar called')
    try {
      const client = await this.databaseService.getClientByCrispId(websiteId);
      let clientData: Client;
      if (client === undefined) {
        clientData = await this.newCrispCompany(websiteId);
      } else {
        clientData = client.data;
      }
      const payload = {
        clientId: clientData.id,
      };

      const jwt = await this.authService.signPayload(payload, 'member');

      res.redirect(baseUrl(`/crisp/frame/chat?token=${jwt}`+'&crisp_email='+crisp_email));

    } catch(error) {
      console.log('error = ', error)
    }
  }
}
