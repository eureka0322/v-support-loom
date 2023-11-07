import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from '../database/database.service';
import { User as UserModel } from '../database/users/users.model';
import { v4 } from 'uuid';
import {
  HubspotContact,
  HubspotModel,
} from '../database/hubspot/hubspot.model';
import { ApiService } from '../api/api.service';
import { RequestLinkDto } from '../api/dtos/link-request.dto';
import { HubspotChatCreateLinkDto } from './dtos/hubspot-chat-create-link.dto';
import { ConfigService } from '../config/config.service';
import { baseUrl } from '../utils';

import { Client as HbClient, propertiesModels } from '@hubspot/api-client';
import { HubspotOauthDto } from './dtos/hubspot-oauth.dto';
import { Recording } from '../database/recordings/recording.model';
import { AccountService, CreateAccountDto } from '../account/account.service';
import { AuthService } from '../auth/auth.service';

const msPerSec = 1000;

@Injectable()
export class HubspotService {
  private readonly hubspotClient: HbClient;
  private readonly hubspotClientId: string;
  private readonly hubspotClientSecret: string;

  constructor(
    private readonly apiService: ApiService,
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly accountService: AccountService,
    configService: ConfigService
  ) {
    this.hubspotClientId = configService.getString('HUBSPOT_CLIENT_ID', false);
    this.hubspotClientSecret = configService.getString(
      'HUBSPOT_CLIENT_SECRET',
      false
    );
    this.hubspotClient = new HbClient();
  }

  async updateTicketHook(
    hubspotId: number,
    recordingId: string,
    conversationId: string
  ) {
    const ticketId =
      await this.databaseService.getHubspotTicketIdByConversationId(
        hubspotId,
        conversationId
      );

    const recording = await this.databaseService.getRecordingByUuid(
      recordingId
    );

    if (recording === undefined) {
      throw new InternalServerErrorException(
        "Can't find recording in database"
      );
    }

    if (ticketId === undefined) {
      throw new InternalServerErrorException(
        "Can't find ticket ID in database"
      );
    }

    await this.databaseService.updateRecordingReservedMetadata(
      recording?.docRef,
      {
        hubspotTicketId: ticketId,
      }
    );
  }

  async registerTicket(
    hubspotId: number,
    conversationId: string,
    ticketId: string
  ) {
    await this.databaseService.createHubspotTicketConversationAssociation(
      hubspotId,
      conversationId,
      ticketId
    );
  }

  async hubRefreshAccessToken(accountId: number, refreshToken: string) {
    const apiResponse = await axios({
      method: 'POST',
      url: `https://api.hubapi.com/oauth/v1/token`,
      params: {
        grant_type: 'refresh_token',
        client_id: this.hubspotClientId,
        client_secret: this.hubspotClientSecret,
        refresh_token: refreshToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const newAccessToken = apiResponse.data.access_token;
    const expirationDate = apiResponse.data.expires_in * msPerSec + Date.now();

    // Update database with new token and expiration
    // Can be performed asynchronously
    this.databaseService
      .getHubspotDocRefByAccountId(accountId)
      .then((hbDocRef) => {
        this.databaseService.updateHubspotAccessToken(
          hbDocRef,
          newAccessToken,
          expirationDate
        );
      })
      .catch((err) => {
        throw err;
      });

    return newAccessToken;
  }

  // Retrieves the access token, and if it's expired, refreshes and stores a new one
  async getValidAccessToken(accountId: number): Promise<string> {
    const hubspotAccount = await this.databaseService.getHubspotByAccountId(
      accountId
    );

    if (hubspotAccount === undefined) {
      throw new UnauthorizedException("Can't find account");
    }

    let accessToken;

    // Give a 1 minute buffer, to avoid the token being used too late
    const secsBuffer = 60;
    const expirationBuffer = secsBuffer * msPerSec;
    const expirationTimeWithBuffer =
      hubspotAccount.data.tokenExpiration - expirationBuffer;

    if (expirationTimeWithBuffer < Date.now()) {
      // Create new access token using the refresh token
      const refreshToken = hubspotAccount.data.refreshToken;

      const newAccessToken = await this.hubRefreshAccessToken(
        accountId,
        refreshToken
      );

      accessToken = newAccessToken;
    } else {
      accessToken = hubspotAccount.data.accessToken;
    }

    if (accessToken === undefined) {
      throw new UnauthorizedException('Not authorized to make this request');
    }

    return accessToken;
  }

  async startChat(chatParams: HubspotChatCreateLinkDto) {
    const hubspotId = chatParams.portalId;
    const conversationId = chatParams.session.conversationId;

    const client = await this.databaseService.getClientByHubspotId(hubspotId);
    const accessToken = await this.getValidAccessToken(hubspotId);

    // if (!this.clientValidationService.validateClient(client))
    //    throw new Error("Account doesn't have a valid subscription")

    if (client === undefined) {
      throw new Error('Cannot find client');
    }

    let requestLinkDto = await this.apiService.updateRequestLinkFromClient(
      new RequestLinkDto(),
      client.data
    );

    requestLinkDto.postRecordHooks = [
      {
        name: 'Respond to Hubspot',
        url: baseUrl('hubspot/hooks/chat/ticket/update'),
      },
    ];

    // TODO(Joao): _check_v2
    // Remove todo
    // Allow not only string?
    requestLinkDto.reservedMetadata = {
      hubspotId: `${hubspotId}`,
      hubspotConversationId: `${conversationId}`,
    };

    requestLinkDto.options = {
      tinyUrl: true,
    };

    const videoUrl = await this.apiService.createLinkRequest(
      requestLinkDto,
      client.data
    );

    return {
      botMessage: `
      <a href="${videoUrl}" target="_blank">Click here</a> to record a video`,
      responseExpected: false,
    };
  }

  async fetchCrmCardTicket(accountId: number, ticketId: string) {
    let recordings = await this.databaseService.getRecordingsByHubspotTicketId(
      ticketId
    );

    let cards = recordings.map((recording: any, index: any) => {
      return {
        objectId: index + 1,
        title: `Video ${index + 1}`,
        link: `${recording.data.recording.videoUrl}`,
        properties: [
          {
            label: 'Created on',
            dataType: 'STRING',
            value: `${new Date(recording.data.recording.recordedAt)}`,
          },
        ],
      };
    });

    return {
      results: cards,
    };
  }

  async fetchCrmCardContact(
    accountId: number,
    firstName: string,
    customerEmail: string,
    clientEmail: string
  ) {
    const client = await this.databaseService.getClientByHubspotId(accountId);

    if (client === undefined) {
      throw new InternalServerErrorException(
        "Client can't be found in database"
      );
    }

    const clientId = client.data.id;

    let recordings = (
      await this.databaseService.getRecordingsByCustomerEmail(
        clientId,
        customerEmail
      )
    ).map((recording: { docRef: string; data: Recording }) => {
      return recording.data;
    });

    // Make sure that latest recording are on top, by sorting them
    recordings.sort((firstEl: Recording, secondEl: Recording) => {
      if (firstEl.recording.recordedAt > secondEl.recording.recordedAt) {
        return -1;
      } else {
        return 1;
      }
    });

    let cards: {
      objectId: number;
      title: string;
      link?: string;
      properties?: any[];
    }[] = recordings.map((recording: Recording, index: number) => {
      const recordDate = new Date(recording.recording.recordedAt);
      let formattedDate = recordDate.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
      let properties = [];
      if (recording.reservedMetadata?.createdBy) {
        properties.push({
          label: 'Created by',
          dataType: 'STRING',
          value: recording.reservedMetadata.createdBy,
        });
      } else {
        properties.push({
          label: 'Requested by',
          dataType: 'STRING',
          value: recording.reservedMetadata?.requestedBy
            ? recording.reservedMetadata.requestedBy
            : 'not specified',
        });
      }
      if (recording.reservedMetadata?.hsTitleDisplay) {
        formattedDate = `${recording.reservedMetadata.hsTitleDisplay} ${formattedDate}`;
      }
      return {
        objectId: index + 1,
        title: formattedDate,
        link: baseUrl(`recording/${recording.id}?type=support`),
        properties: properties,
      };
    });

    const payload = {
      clientId,
    };
    const jwt = await this.authService.signPayload(payload, 'member');

    // TODO(Joao): _check_v2
    // Create a signed access token so we know that
    // the request is authorized
    const button = {
      type: 'IFRAME',
      httpMethod: 'GET',
      width: 450,
      height: 850,
      uri: baseUrl(
        `hubspot/request?token=${jwt}&customerEmail=${customerEmail}&customerName=${firstName}&clientEmail=${clientEmail}`
      ),
      label: 'Request video',
      associatedObjectProperties: ['name'],
    };

    return {
      results: cards,
      primaryAction: button,
    };
  }

  async updateContacts(accountId: number, accessToken: string) {
    const urlContacts = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const resContacts = await axios({
      method: 'GET',
      url: urlContacts,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const contacts = resContacts.data.results;

    const hbDocRef = await this.databaseService.getHubspotDocRefByAccountId(
      accountId
    );

    const client = await this.databaseService.getClientByHubspotId(accountId);

    if (client === undefined) {
      throw new InternalServerErrorException(
        "Client can't be found in database"
      );
    }

    const contactPromises: Promise<HubspotContact>[] = await contacts.map(
      async (contact: any) => {
        const recordings = (
          await this.databaseService.getRecordingsByCustomerEmail(
            client.data.id,
            contact.properties.email
          )
        ).map((recording: { docRef: string; data: Recording }) => {
          return recording.docRef;
        });
        return new HubspotContact(contact.properties.email, recordings);
      }
    );

    const contactsUpdate = await Promise.all(contactPromises);

    await this.databaseService.updateHubspotContacts(hbDocRef, contactsUpdate);
  }

  async addUsersToDb(accessToken: string, clientId: string) {
    // Get user data
    const urlUsers = 'https://api.hubapi.com/settings/v3/users';
    const resUsers = await axios.get(urlUsers, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const users: any[] = resUsers.data.results;
    const numberOfSeats = users.length;

    if (numberOfSeats === 0) {
      return;
    }

    let newUsers = 0;
    let createPromises = [];
    for (const hbUser of users) {
      // Try to find user in database, and add if it doesn't exist
      const dbUser = await this.databaseService.getUserByEmail(hbUser.email);
      if (dbUser?.data) {
        // User already in database, possibly attached to another company
        // Could not import it
        continue;
      }

      const userId = v4();
      const userEmail = hbUser.email;
      const role = 'member';

      const newUser = new UserModel(
        userId,
        userEmail,
        userEmail,
        '',
        clientId,
        role,
        true
      );
      const promise = this.databaseService.createUser(newUser);
      createPromises.push(promise);
      newUsers++;
    }
    await Promise.all(createPromises);
    await this.databaseService.incrementClientSeats(clientId, newUsers);
  }

  async createDbHubspot(
    hubspotId: number,
    accessToken: string,
    refreshToken: string,
    tokenExpiration: number,
    clientId: string
  ) {
    const hasInboxSeat = true;
    // Get list of owners
    const urlOwners = 'https://api.hubapi.com/owners/v2/owners';
    const resOwners = await axios.get(urlOwners, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const owners = resOwners.data;

    const addPromises = [];
    let newUsers = 0;
    for (const hbOwner of owners) {
      // Try to find user in database, and add if it doesn't exist
      const dbUser = await this.databaseService.getUserByEmail(hbOwner.email);
      if (dbUser?.data) {
        // User already in database, possibly attached to another company
        // Could not import it
        continue;
      }

      const userId = v4();
      const userEmail = hbOwner.email;
      const role = 'member';

      const newUser = new UserModel(
        userId,
        userEmail,
        userEmail,
        '',
        clientId,
        role,
        true
      );
      const promise = this.databaseService.createUser(newUser);
      addPromises.push(promise);
      newUsers++;
    }
    addPromises.push(
      this.databaseService.incrementClientSeats(clientId, newUsers)
    );

    const hubspotModel = new HubspotModel(
      hubspotId,
      accessToken,
      refreshToken,
      tokenExpiration,
      owners.map((owner: any) => owner.email),
      []
    );

    await this.databaseService.createHubspot(hubspotModel);
    await Promise.all(addPromises);
  }

  async findSuperadminClient(superAdminEmail: string) {
    const user = await this.databaseService.getUserByEmail(superAdminEmail);
    if (user?.data) {
      return (
        await this.databaseService.getClientByClientId(user.data.organizationId)
      )?.data;
    }
    return undefined;
  }

  async createOrUpdateClient(oauthData: HubspotOauthDto) {
    const apiResponse = await this.hubspotClient.oauth.tokensApi.createToken(
      'authorization_code',
      oauthData.code,
      baseUrl('hubspot/oauth-callback'),
      this.hubspotClientId,
      this.hubspotClientSecret
    );

    const msPerSec = 1000;
    const accessToken = apiResponse.body.accessToken;
    const refreshToken = apiResponse.body.refreshToken;
    const tokenExpiration = apiResponse.body.expiresIn * msPerSec + Date.now();

    // Get company domain name - best we can do
    const urlAccName = `https://api.hubapi.com/oauth/v1/access-tokens/${accessToken}`;
    const resAccName = await axios.get(urlAccName);

    const companyName = resAccName.data.hub_domain;
    const superAdmin = resAccName.data.user;

    // Get hubspot account data
    const urlMe = 'https://api.hubapi.com/integrations/v1/me';
    const resMe = await axios({
      method: 'GET',
      url: urlMe,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const hubspotId = resMe.data.portalId;

    const hsClient = await this.databaseService.getClientByHubspotId(hubspotId);

    if (hsClient !== undefined) {
      // Return early because there's already an account connected to this hubspot ID
      return;
    }

    const existingClient = await this.findSuperadminClient(superAdmin);

    let clientId: string;
    const subscriptionType = 'trial';

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      // Create client organization account
      clientId = v4();
      await this.accountService.createAccount({
        id: clientId,
        companyName: companyName,
        plan: 'prepricing',
        integrations: {},
        seats: 1,
        referrerUrl: 'https://videosupport.io',
        subscriptionType,
      });
    }

    await this.databaseService.addIntegrationToClient(clientId, 'hubspot', {
      accountId: hubspotId,
    });

    await this.createDbHubspot(
      hubspotId,
      accessToken,
      refreshToken,
      tokenExpiration,
      clientId
    );
    await Promise.all([
      this.addUsersToDb(accessToken, clientId),
      this.updateContacts(hubspotId, accessToken),
    ]);
  }
}
