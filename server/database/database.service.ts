import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  ConsoleLogger,
} from '@nestjs/common';
import { IntercomRepository } from '../intercom/intercom.repository';
import { ClientRepository } from './client/client.repository';
import { PricingRepository } from './pricing/pricing.repository';
import { ApiLinkRepository } from './api_link/api-link.repository';
import { User } from './users/users.model';
import { Client } from './client/client.model';
import { UsersRepository } from './users/users.repository';
import { HubspotContact, HubspotModel } from './hubspot/hubspot.model';
import { HubspotRepository } from './hubspot/hubspot.repository';
import { RecordingRepository } from './recordings/recording.repository';
import { RecordingAddDto } from './dtos/recording-add.dto';
import { Recording } from './recordings/recording.model';
import { CreateLinkRecordDto } from './dtos/create-link-record.dto';
import { UpdateBrandingDto } from './dtos/update-branding.dto';
import { UpdateAppReferrerDto } from './dtos/update-app-settings.dto';
import { AuthService } from '../auth/auth.service';
import { RequestAccessRepository } from './request-access/request-access.repository';
import { RequestAccess } from './request-access/request-access.model';
import { SlackRepository } from './slack/slack.repository';
import {
  SubscriptionRepository,
  SubscriptionTypeRepository,
} from './subscription/subscription.repository';
import { SignupSessionRepository } from './signup-session/signup-session.repository';
import { PluginsRepository } from './plugins/plugins.repository';
import { v4 } from 'uuid';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly apiLinkRepository: ApiLinkRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly clientRepository: ClientRepository,
    private readonly intercomRepository: IntercomRepository,
    private readonly hubspotRepository: HubspotRepository,
    private readonly pricingRepository: PricingRepository,
    private readonly recordingRepository: RecordingRepository,
    private readonly requestAccessRepository: RequestAccessRepository,
    private readonly usersRepository: UsersRepository,
    private readonly slackRepository: SlackRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionTypeRepository: SubscriptionTypeRepository,
    private readonly signupSessionRepository: SignupSessionRepository,
    private readonly pluginsRepository: PluginsRepository
  ) {}

  async addSignupSessionState(
    sessionState: string,
    expiration: number,
    usages: number
  ) {
    await this.signupSessionRepository.create(sessionState, expiration, usages);
  }

  async useSignupSessionOnce(session: string) {
    return await this.signupSessionRepository.useOnce(session);
  }

  async clientAddDefaultHook(
    clientId: string,
    hook: { id: string; name: string; url: string; data: any }
  ) {
    return await this.clientRepository.addHook(clientId, hook);
  }

  async getRecordings(clientId: string, limit: number) {
    return await this.recordingRepository.getAll(clientId, limit);
  }

  async clientDeleteDefaultHook(clientId: string, hookId: string) {
    return await this.clientRepository.deleteHook(clientId, hookId);
  }
  async addUserPassword(userId: string, hashedPassword: string) {
    await this.usersRepository.addPassword(userId, hashedPassword);
  }

  async updateUserCrispWidgetStatus(organizationId: string, toUpdate: {
      crisp_client_id?: string
    }) {
    await this.usersRepository.updateUserCrispWidgetStatus(organizationId, toUpdate);
  }

  async updatePassword(userId: string, toUpdate: {
      hashedPassword?: string,
    }) {
    return await this.usersRepository.updatePassword(userId, toUpdate);
  }

  async getSubscriptionType(subscriptionType: string) {
    return await this.subscriptionTypeRepository.find(subscriptionType);
  }

  async atomicUpdateRecordingAssignee(
    recordingId: string,
    assigneeEmail: string
  ) {
    return await this.recordingRepository.atomicUpdateAssignee(
      recordingId,
      assigneeEmail
    );
  }

  async getOrganizationMaxSeats(clientId: string) {
    const subs = await this.getClientSubscription(clientId);
    if (subs && subs.paidSeats) {
      return {
        maxSeats: subs.paidSeats,
      };
    }
  }

  async getClientBySlackTeamId(teamId: string) {
    return await this.clientRepository.getBySlackTeamId(teamId);
  }

  async getSlackTokenFromClientId(clientId: string) {
    const client = await this.getClientByClientId(clientId);
    if (client) {
      const slack = await this.getSlackFromTeamId(
        client.data.settings.integrations.slack.teamId
      );
      return slack?.bot_token;
    }
  }

  async getClientSubscription(clientId: string) {
    const client = await this.getClientByClientId(clientId);
    console.log('client getClientSubscription = ', client)
    if (client) {
      const subscription = await this.subscriptionRepository.getById(
        client?.data.subscription
      );
      return subscription;
    } else {
      throw new BadRequestException();
    }
  }

  async getOrganizationSubscription(clientId: string) {
    const org = await this.clientRepository.getClientByClientId(clientId);
    console.log('org = ',org)
    if (!org) {
      const msg = `Subscription for inexistent organization: ${clientId}`;
      console.error(msg);
      throw new BadRequestException(msg);
    }
    const subs = await this.subscriptionRepository.getById(
      org.data.subscription
    );
    console.log('subs = ',subs)
    if (!subs) {
      const msg = `Subscription of organization not found in DB: ${org.data.subscription}`;
      console.error(msg);
      throw new BadRequestException(msg);
    }
    const subsType = await this.subscriptionTypeRepository.find(
      subs?.subscriptionType
    );
    const seats = subs.paidSeats ? subs.paidSeats : org.data.settings.seats;
    console.log('subsType = ', subsType)
    console.log('seats = ', seats)
    let paid_seats = (subs.paidSeats?subs.paidSeats:0)-(subs.freeSeats?subs.freeSeats:0);
    console.log('paid_seats = ', paid_seats);
    const totalPrice = subsType.pricePerSeat
      ? subsType.pricePerSeat * paid_seats
      : 0;
    let upsell;
    if (subsType.upsell) {
      upsell = await this.subscriptionTypeRepository.find(subsType.upsell);
      const upsellTotalPrice = upsell.pricePerSeat
        ? upsell.pricePerSeat * seats
        : 0;
      upsell = {
        totalPrice: upsellTotalPrice,
        ...upsell,
      };
    }
    let expirationDate;
    if (subs.subscriptionEnd) {
      expirationDate = subs.subscriptionEnd;
    }
    let subscriptionDisplayName = subs.subscriptionDisplayName;
    
    return {
      ...subsType,
      upsell,
      totalPrice,
      seats,
      paidSeats: paid_seats,
      expirationDate,
      subscriptionDisplayName,
    };
  }

  async getOrganizationSubscriptionCrisp(clientId: string) {
    const org = await this.clientRepository.getClientByClientId(clientId);
    if (!org) {
      const msg = `Subscription for inexistent organization: ${clientId}`;
      console.error(msg);
      return false
    }
    const subs = await this.subscriptionRepository.getById(
      org.data.subscription
    );
    if (!subs) {
      const msg = `Subscription of organization not found in DB: ${org.data.subscription}`;
      console.error(msg);
      return false
    }
    const subsType = await this.subscriptionTypeRepository.find(
      subs?.subscriptionType
    );
    const seats = subs.paidSeats ? subs.paidSeats : org.data.settings.seats;
    const totalPrice = subsType.pricePerSeat
      ? subsType.pricePerSeat * seats
      : 0;
    let upsell;
    if (subsType.upsell) {
      upsell = await this.subscriptionTypeRepository.find(subsType.upsell);
      const upsellTotalPrice = upsell.pricePerSeat
        ? upsell.pricePerSeat * seats
        : 0;
      upsell = {
        totalPrice: upsellTotalPrice,
        ...upsell,
      };
    }
    let expirationDate;
    if (subs.subscriptionEnd) {
      expirationDate = subs.subscriptionEnd;
    }
    return {
      ...subsType,
      upsell,
      totalPrice,
      seats,
      paidSeats: subs.paidSeats,
      expirationDate,
    };
  }

  async updateSubscriptionStripePayment(
    clientId: string,
    toUpdate: {
      subscriptionType?: string;
      paidSeats?: number;
      stripeSubscriptionId?: string;
      stripeCustomerId?: string;
      subscriptionStart?: number;
      subscriptionEnd?: number;
    }
  ) {
    const client = await this.clientRepository.getClientByClientId(clientId);

    if (client) {
      await this.subscriptionRepository.updateSubscription(
        client.data.subscription,
        toUpdate
      );
    }
  }

  async updateSubscription(
    clientId: string,
    toUpdate: {
      subscriptionType?: string;
      paidSeats?: number;
      stripeSubscriptionId?: string;
      stripeCustomerId?: string;
    }
  ) {
    const client = await this.clientRepository.getClientByClientId(clientId);

    if (client) {
      await this.subscriptionRepository.updateSubscription(
        client.data.subscription,
        toUpdate
      );
    }
  }

  async getSlackFromTeamId(teamId: string) {
    return await this.slackRepository.getByTeamId(teamId);
  }

  // Warning: don't expose to public API
  async getAllIntercomClients() {
    const intercoms = this.intercomRepository.extract(
      await this.intercomRepository.get()
    );
    const clients = await Promise.all(
      intercoms.map(async (intercom) => {
        const workspaceId = intercom.data.workspaceId;
        const client = await this.clientRepository.getByIntercomId(workspaceId);
        return {
          clientId: client?.docRef,
          workspaceId: workspaceId,
          accessToken: intercom.data.accessToken,
        };
      })
    );
    return clients.filter((client) => client.clientId);
  }

  async createSlack(teamId: string, payload: any) {
    return await this.slackRepository.create(teamId, payload);
  }

  async addIntegrationToClient(
    clientId: string,
    integrationName: string,
    data: { [key: string]: string }
  ) {
    return await this.clientRepository.addIntegration(
      clientId,
      integrationName,
      data
    );
  }

  async getClientMembers(id: string) {
    return await this.usersRepository.getByClientId(id);
  }

  async getAdminByClientId(id: string) {
    return await this.usersRepository.getAdminByClientId(id);
  }

  async getRecordingsMatching(
    clientId: string,
    match: { [key: string]: string }
  ) {
    return await this.recordingRepository.getMatching(clientId, match);
  }

  async getRecordingsUnassigned(clientId: string, limit: number) {
    return await this.recordingRepository.getUnassigned(clientId, limit);
  }

  async getUserById(id: string) {
    return await this.usersRepository.getById(id);
  }

  async getRecordingByUuid(recordingId: string) {
    return await this.recordingRepository.getByUuid(recordingId);
  }

  async getRecordingsByIntercomContactId(clientId: string, contactId: string) {
    return await this.recordingRepository.getByIntercomContactId(
      clientId,
      contactId
    );
  }

  // Gets a recording, and if links are expired, creates a new one
  async getRecordingWithValidUrl(id: string) {
    let recording = await this.recordingRepository.getDocumentById(id);
    const expiration = recording.recording.linkExpiration;
    const compressed = recording.recording.compressed;

    // One day buffer
    const buffer = 1000 * 60 * 60 * 24;

    if (expiration && expiration - buffer < Date.now()) {
      // Passed expiration, generate new URLs
      const newVideo = compressed
        ? await this.authService.presignedS3GetVideoCompressed(id)
        : await this.authService.presignedS3GetVideo(id);
      const newVideoUrl = newVideo.url;
      const newExpiration = newVideo.expiration;
      const newRecording = await this.recordingRepository.updateVideo(
        id,
        newVideoUrl,
        newExpiration
      );
      recording = newRecording;
    }

    if (recording) {
      return recording;
    } else {
      return {
        status: 'error',
        statusCode: 400,
        message: 'Bad request',
      };
    }
  }

  async getHubspotTicketIdByConversationId(
    hubspotId: number,
    conversationId: string
  ) {
    return await this.hubspotRepository.findTicketConversationAssociation(
      hubspotId,
      conversationId
    );
  }

  async getIntercomByClientId(clientId: string) {
    const client = await this.clientRepository.getClientByClientId(clientId);
    if (client?.data && client.data.settings.integrations.intercom) {
      const intercomId = client.data.settings.integrations.intercom.workspaceId;
      if (intercomId) {
        const ans = await this.intercomRepository.getByWorkspaceId(intercomId);
        return ans;
      }
    }
    return undefined;
  }

  async incrementClientSeats(clientId: string, newSeats: number) {
    return await this.clientRepository.incrementSeats(clientId, newSeats);
  }

  async updateRecordingCompressed(id: string) {
    const compressedLink = await this.authService.presignedS3GetVideoCompressed(
      id
    );
    await this.recordingRepository.updateVideoCompressed(
      id,
      compressedLink.url,
      compressedLink.expiration
    );
  }

  async updateRecordingMetadata(
    recordingRefId: string,
    metadata: { [key: string]: string | number | boolean }
  ) {
    return await this.recordingRepository.updateMetadata(
      recordingRefId,
      metadata
    );
  }
  async updateRecordingReservedMetadata(
    recordingRefId: string,
    reservedMetadata: { [key: string]: string | number | boolean }
  ) {
    return await this.recordingRepository.updateReservedMetadata(
      recordingRefId,
      reservedMetadata
    );
  }

  async createHubspotTicketConversationAssociation(
    hubspotId: number,
    conversationId: string,
    ticketId: string
  ) {
    return await this.hubspotRepository.createTicketConversationAssociation(
      hubspotId,
      conversationId,
      ticketId
    );
  }

  async getRecordingByRefId(id: string) {
    return await this.recordingRepository.getDocumentById(id);
  }

  async getLinkById(id: string) {
    return await this.apiLinkRepository.getById(id);
  }

  async createLinkRecord(link: CreateLinkRecordDto) {
    return await this.apiLinkRepository.create(link);
  }

  async checkRecordingToDb(linkId: string) {
    return await this.recordingRepository.checkRecordingToDb(linkId);
  }

  currentDate() {

    let date_time = new Date();

    // get current date
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);

    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    // get current year
    let year = date_time.getFullYear();

    // get current hours
    let hours = date_time.getHours();

    // get current minutes
    let minutes = date_time.getMinutes();

    // get current seconds
    let seconds = date_time.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    var current_date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return current_date;
  }

  async addRecordingToDb(recToAdd: RecordingAddDto) {
    console.log('addRecordingToDb called')
    const link = await this.getLinkById(recToAdd.linkId);
    const metadata = link?.metadata;
    const reservedMetadata = link?.reservedMetadata;
    const customer = link?.customer;
    const requester = link?.requester;
    const recordingId = recToAdd.recordingId;
    const assigned = {
      status: false,
    };

    console.log(recToAdd.recording);

    var currentDate = this.currentDate()

    const recording = new Recording(
      recordingId,
      recToAdd.clientId,
      recToAdd.linkId,
      currentDate,
      Object.assign({}, recToAdd.recording),
      Object.assign({}, recToAdd.device),
      Object.assign({}, metadata),
      Object.assign({}, reservedMetadata),
      Object.assign({}, customer),
      Object.assign({}, requester),
      Object.assign({}, assigned)
    );

    // Update recordingAmount counter
    if (recToAdd.clientId) {
      await this.clientRepository.incrementRecordingAmountCounter(
        recToAdd.clientId
      );
    }

    // TODO(Joao): _check_v2
    return await this.recordingRepository
      .addRecording(recording)
      .then((refId) => {
        return refId;
      })
      .catch((err) => {
        console.error(`[addRecordingToDb] ${err}`);
        throw new BadRequestException();
      });
  }

  async getClientByZendeskId(id: string) {
    return await this.clientRepository.getClientByZendeskId(id);
  }

  async getClientByCrispId(id: string) {
    return await this.clientRepository.getClientByCrispId(id);
  }

  async getAllClients() {
    return await this.clientRepository.getAllClients();
  }

  async getClientByIntercomId(id: string) { 
    return await this.clientRepository.getByIntercomId(id);
  }

  async getPricingPlan(tier: string) {
    const pricing = await this.pricingRepository.getPricingByTier(tier);

    return {
      ...pricing,
    };
  }

  async getClientByClientId(id: string) {
    return await this.clientRepository.getClientByClientId(id);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async getUserForCrispWidget(clientId:string, email: string) {
    return await this.usersRepository.getUserForCrispWidget(clientId, email);
  }

  async getUserByClientId(clientId: string) {
    return await this.usersRepository.getUserByClientId(clientId);
  }

  async updateUserEmailByUserId(userId: string, email: string) {
    return await this.usersRepository.updateEmail(userId, email);
  }

  async updateClientHubspot(clientDocRef: string, hubspotDocRef: string) {}

  async createUser(user: User) {
    return await this.usersRepository.createUser(user);
  }

  async deleteclient(clientId: string) {
    return await this.clientRepository.deleteClient(clientId);
  }
  async createClient(client: Client) {
    return await this.clientRepository.createClient(client);
  }

  async createHubspot(hubspot: HubspotModel) {
    return await this.hubspotRepository.create(hubspot);
  }

  async getHubspotByAccountId(accountId: number) {
    return await this.hubspotRepository.getByAccountId(accountId);
  }

  async getHubspotDocRefByAccountId(accountId: number) {
    return await this.hubspotRepository.getDocRefByAccountId(accountId);
  }

  async updateHubspotContacts(docRef: string, contacts: HubspotContact[]) {
    return await this.hubspotRepository.updateContacts(docRef, contacts);
  }

  async getRecordingsByCustomerEmail(accountId: string, email: string) {
    return await this.recordingRepository.getRecordingByCustomerEmail(
      accountId,
      email
    );
  }

  async getRecordingsByHubspotTicketId(ticketId: string) {
    return await this.recordingRepository.getRecordingByHubspotTicketId(
      ticketId
    );
  }

  async getClientByHubspotId(hubspotId: number) {
    return await this.clientRepository.getClientByHubspotId(hubspotId);
  }

  async getAccessTokenFromHubspotId(hubspotId: number) {
    return await this.hubspotRepository.getAccessTokenByAccountId(hubspotId);
  }

  async updateHubspotAccessToken(
    docRef: string,
    newToken: string,
    expirationDate: number
  ) {
    return this.hubspotRepository.updateAccessToken(
      docRef,
      newToken,
      expirationDate
    );
  }

  async updateBranding(clientId: string, req: UpdateBrandingDto) {
    await this.clientRepository.updateBranding(
      clientId,
      req.primaryColour,
      req.secondaryColour,
      req.logo
    );
  }

  async updateAppSettings(clientId: string, req: UpdateAppReferrerDto) {
    await this.clientRepository.updateAppSettings(clientId, req.referrerUrl);
  }

  async updateIntercomAccessToken(intercomDocRef: string, accessToken: string) {
    await this.intercomRepository.updateAccessToken(
      intercomDocRef,
      accessToken
    );
  }
  async updateUsersSeats(clientId: string, users: { [key: string]: boolean }) {
    const updated = await this.usersRepository.updateSeats(clientId, users);
    await this.clientRepository.updateSeats(clientId, updated);
  }

  async requestCompanyAccess(email: string) {
    const createdAt = Date.now();
    const requestAccessModel = new RequestAccess(createdAt, email);

    const requestAccessRefId = await this.requestAccessRepository.addRequest(
      requestAccessModel
    );

    if (requestAccessRefId) {
      return {
        status: 'ok',
        message: 'Request created',
      };
    } else {
      return {
        status: 'error',
        message: 'Unable to create Request',
      };
    }
  }

  async settingsAppPlugins(clientId: string) {
    const client = await this.getClientByClientId(clientId);
    if (!client) throw new BadRequestException('Client ID not found');
    const postHooks = client.data.settings.defaultHooks;
    return await Promise.all(
      Object.keys(postHooks).map(async (key) => {
        const name = postHooks[key].name;
        const config = postHooks[key].data;
        const description = await this.pluginsRepository.retrieve(name);
        return {
          id: key,
          description,
          config,
        };
      })
    );
  }

  async settingsAppPluginsUpdate(
    clientId: string,
    body: {
      id: string;
      fieldName: string;
      value: string | string[];
    }
  ) {
    await this.clientRepository.updateAppHook(
      clientId,
      body.id,
      body.fieldName,
      body.value
    );
  }

  async countRequestSendLink(clientId: string) {
    return await this.recordingRepository.countRequestSendLink(clientId);
  }

  async uploadLogo(clientId: string, file: Record<string, any>) {
    const logoId = v4();
    const plainFilename = file.originalname.split('.');
    let extension;
    if (plainFilename.length == 2) {
      extension = `${plainFilename[1]}`;
    } else {
      extension = 'jpg';
    }
    const filename = `${logoId}.${extension}`;
    return await this.authService.uploadLogoS3(filename, file.path);
  }
}
