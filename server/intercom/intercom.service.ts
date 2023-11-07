import { BadRequestException, Injectable } from '@nestjs/common';
import { shorten } from 'tinyurl';
import * as moment from 'moment';
import { performance } from 'perf_hooks';

import { DatabaseService } from '../database/database.service';
import { IntercomRepository } from './intercom.repository';
import { IntercomModel } from './intercom.model';
import { v4 } from 'uuid';
import { AccountService } from '../account/account.service';
import axios from 'axios';
import { CanvasBodyDto } from './dto/canvas-body.dto';
import { ConfigService } from '../config/config.service';
import { User as UserModel } from '../database/users/users.model';
import { ApiService } from '../api/api.service';
import { RequestLinkDto } from '../api/dtos/link-request.dto';
import { baseUrl } from '../utils';
import { SubmitBodyDto } from './dto/submit-body.dto';
import {
  InboxAdminDto,
  InboxContactDto,
  InitializeInboxDto,
} from './dto/initialize-inbox.dto';
import { Client as ClientModel } from '../database/client/client.model';
import { RecordingAddDto } from '../database/dtos/recording-add.dto';

// Interface for user coming from Intercom
export interface IntercomUser {
  id: number;
  accessToken: string;
  workspaceId: string;
  name: string;
  email: string;
  has_inbox_seat: boolean;
}

export interface IntercomAdmin {
  type: string;
  email: string;
  id: string;
  name: string;
  away_mode_enabled: boolean;
  away_mode_reassign: boolean;
  has_inbox_seat: boolean;
  // TODO(Joao): _intercom string[]?
  team_ids: any[];
}

@Injectable()
export class IntercomService {
  private readonly jwtSecret: string;
  private readonly intercomAccessToken: string;

  constructor(
    private readonly apiService: ApiService,
    private readonly accountService: AccountService,
    private readonly databaseService: DatabaseService,
    private readonly intercomRepository: IntercomRepository,
    configService: ConfigService
  ) {
    this.intercomAccessToken = configService.getString(
      'INTERCOM_ACCESS_TOKEN',
      false
    );
    this.jwtSecret = configService.getString('JWT_SECRET', false);
  }

  async addAllAdmins(
    clientId: string,
    workspaceId: string,
    accessToken: string,
    silent?: boolean
  ) {
    const workspaceAdmins = await axios
      .get('https://api.intercom.io/admins', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch((err) => {
        if (!silent) {
          console.error(
            `[intercom/addAllAdmins] Can't retrieve admins: ${err}`
          );
        }
        throw new BadRequestException("Can't retrieve Intercom admins");
      });

    let newUsers = 0;
    let createUserPromises = [];
    const operatorEmail = `operator+${workspaceId}@intercom.io`;

    if (workspaceAdmins && workspaceAdmins.data.length !== 0) {
      const admins = workspaceAdmins.data.admins as IntercomAdmin[];
      for (const admin of admins) {
        // If admin doesn't have email, use operator simply
        const adminEmail = admin.email || operatorEmail;

        const dbUser = await this.databaseService.getUserByEmail(admin.email);
        if (dbUser === undefined) {
          // We need to allocate seat for intercom operator/bot, even if
          // has_inbox_seat is false
          let hasInboxSeat =
            admin.email === operatorEmail ? true : admin.has_inbox_seat;

          const adminName = admin.name || '';
          // Photo not available from intercom
          const photo = '';
          // Always add as member
          const organizationRole = 'member';

          const user = new UserModel(
            v4(),
            adminName,
            adminEmail,
            photo,
            clientId,
            organizationRole,
            hasInboxSeat
          );
          createUserPromises.push(this.databaseService.createUser(user));
          newUsers = hasInboxSeat ? newUsers + 1 : newUsers;
        }
      }
      await Promise.all(createUserPromises);
      await this.databaseService.incrementClientSeats(clientId, newUsers);
    }
  }

  async installIntercom(intercomUser: IntercomUser) {
    // Check if user is already in the database and is attached
    // to an organization
    const dbUser = await this.databaseService.getUserByEmail(
      intercomUser.email
    );

    let clientId;

    if (dbUser?.data) {
      clientId = dbUser.data.organizationId;

      if (dbUser.data.organizationRole !== 'admin') {
        // TODO(Joao): _intercom
        // Throw error, redirect to 'no authorization to perform
        // this action
      }

      // If user is in database, check if client already has intercom
      // installed
      const intercom = await this.databaseService.getIntercomByClientId(
        clientId
      );

      if (intercom?.data) {
        if (intercomUser.accessToken != intercom.data.accessToken) {
          // Access token is different than stored, update it
          await this.databaseService.updateIntercomAccessToken(
            intercom.docRef,
            intercomUser.accessToken
          );
        }
      } else {
        // Intercom doesn't exist, create it
        await this.createIntercom(
          clientId,
          intercomUser.workspaceId,
          intercomUser.accessToken
        );
      }
    } else {
      clientId = v4();
      // Extract domain from email because Intercom doesn't
      // provide company name otherwise
      const [_, companyName] = intercomUser.email.split('@');
      const organizationRole = 'admin';
      const subscriptionType = 'trial';

      // User does't exist, create user and client in database
      const accountPromise = this.accountService.createAccount({
        id: clientId,
        companyName: companyName,
        plan: 'prepricing',
        integrations: {},
        seats: 1,
        referrerUrl: 'https://videosupport.io',
        subscriptionType,
      });
      const photoName = '';
      const userPromise = this.databaseService.createUser(
        new UserModel(
          v4(),
          intercomUser.name,
          intercomUser.email,
          photoName,
          clientId,
          organizationRole,
          intercomUser.has_inbox_seat
        )
      );
      await Promise.all([accountPromise, userPromise]);
      await this.databaseService.incrementClientSeats(clientId, 1);
      await this.createIntercom(
        clientId,
        intercomUser.workspaceId,
        intercomUser.accessToken
      );
    }
    await this.addAllAdmins(
      clientId,
      intercomUser.workspaceId,
      intercomUser.accessToken
    );
  }

  async createIntercom(
    clientId: string,
    workspaceId: string,
    accessToken: string
  ) {
    const model = new IntercomModel(workspaceId, accessToken);
    const createIntercomPromise = this.intercomRepository.createUser(model);
    const updateClientPromise = this.databaseService.addIntegrationToClient(
      clientId,
      'intercom',
      {
        workspaceId: workspaceId,
      }
    );
    await Promise.all([createIntercomPromise, updateClientPromise]);
  }

  async configure(workspaceId: string, inputValues?: any) {
    const client = await this.databaseService.getClientByIntercomId(
      workspaceId
    );

    if (
      client?.data &&
      (await this.accountService.verifyClient(client?.data))
    ) {
      if (inputValues === undefined) {
        return this.canvasCreateWidget();
      } else if (inputValues) {
        const values =
          Object.values(inputValues).length !== 0
            ? { ...inputValues }
            : { frame_title: '', frame_description: '', frame_button: '' };
        return {
          results: values,
        };
      }
    } else {
      // Unauthorized
      console.error(`Client with Intercom ID ${workspaceId} is unauthorized`);
      return this.canvasUpgradeAccount();
    }
  }

  async canvas(body: CanvasBodyDto) {
    const contactId = body.contact && body.contact.id;
    const conversationId = body.canvas.stored_data.conversation_id;
    const workspaceId = body.workspaceId;
    const customAttributes = body.contact && body.contact.custom_attributes;
    const jobTitle = body.canvas.stored_data.admin.job_title
      ? body.canvas.stored_data.admin.job_title
      : 'Customer Support';

    const removeNULLfromAttributes =
      customAttributes &&
      Object.entries(customAttributes).reduce(
        // @ts-ignore
        (a, [k, v]) => (v === null ? a : ((a[k] = v), a)),
        {}
      );

    // Must always have admin email, so when it's not present,
    // we use the operator e-mail as a placeholder
    const operatorEmail = `operator+${workspaceId}@intercom.io`;
    const admin = {
      id: body.canvas.stored_data.admin.id,
      name: body.canvas.stored_data.admin.name,
      email: body.canvas.stored_data.admin.email || operatorEmail,
      photo: body.canvas.stored_data.admin.avatar,
      job_title: jobTitle,
    };

    const client = await this.databaseService.getClientByIntercomId(
      workspaceId
    );

    if (client?.data && (await this.accountService.verifyClient(client.data))) {
      let existingUser = await this.databaseService.getUserByEmail(admin.email);
      let user;

      if (existingUser?.data === undefined) {
        const photo = '';
        const organizationRole = 'member';
        const newUser = new UserModel(
          v4(),
          admin.name || '',
          admin.email,
          photo,
          client.data.id,
          organizationRole,
          true
        );
        await Promise.all([
          this.databaseService.createUser(newUser),
          this.databaseService.incrementClientSeats(client.data.id, 1),
        ]);
        user = newUser;
      } else {
        user = existingUser.data;
      }

      if (!user?.hasSeat) {
        console.error(
          `Client with Intercom ID ${workspaceId} has user without seat: ${admin.email}`
        );
        return this.canvasUnauthorizedAgent();
      }
    } else {
      console.error(
        `Client with Intercom ID ${workspaceId} has no valid account`
      );
      return this.canvasUpgradeAccount();
    }

    const customerSide = !!customAttributes;

    let actionUrl;

    if (customerSide) {
      const intercomContactId = contactId as string;
      const user = {
        id: contactId as string,
        name: body.contact && body.contact.name,
        email: body.contact && body.contact.email,
        phone: body.contact && body.contact.phone,
      };

      actionUrl = await this.createLinkUrl(
        client.data,
        user,
        admin,
        intercomContactId,
        admin.id,
        false,
        conversationId,
        removeNULLfromAttributes
      );
    } else {
      // The link is disabled for the agent, so in this branch
      // we can just put any value to the link
      actionUrl = 'https://videosupport.io';
    }

    const titleCopy = body.canvas.stored_data.card?.frame_title;
    const descriptionCopy = body.canvas.stored_data.card?.frame_description;
    const buttonCopy = body.canvas.stored_data.card?.frame_button;

    return this.canvasReadyToHelp(
      titleCopy,
      customerSide,
      descriptionCopy,
      actionUrl,
      buttonCopy
    );
  }

  async createLinkPayload(
    client: ClientModel,
    userData: InboxContactDto | undefined,
    adminData: InboxAdminDto | undefined,
    contactId: string,
    adminId: string,
    supportReply: boolean,
    conversationId?: string,
    customAttributes?: { [key: string]: string }
  ) {
    // TODO(Joao): _intercom
    // Remove, called elsewhere
    let linkRequest = await this.apiService.updateRequestLinkFromClient(
      new RequestLinkDto(),
      client
    );

    linkRequest.postRecordHooks = [
      {
        name: 'Respond to Intercom chat',
        url: baseUrl('intercom/conversation/submit'),
      },
    ];

    if (customAttributes) {
      linkRequest.metadata = {
        ...customAttributes,
      };
    }

    linkRequest.reservedMetadata = {
      intercomAdminId: adminId,
      intercomContactId: contactId,
    };

    if (conversationId) {
      linkRequest.reservedMetadata = {
        ...linkRequest.reservedMetadata,
        intercomConversationId: conversationId,
        secondaryButton: true,
        secondaryButtonText: 'Go to Intercom conversation',
        secondaryButtonUrl: `https://app.intercom.com/a/apps/${client.settings.integrations.intercom.workspaceId}/inbox/inbox/all/conversations/${conversationId}`,
      };
    }

    if (supportReply) {
      linkRequest.reservedMetadata = {
        ...linkRequest.reservedMetadata,
        intercomSupportReply: true,
      };
    }

    if (userData) {
      linkRequest.customer = {
        ...userData,
      };
    }

    if (adminData) {
      linkRequest.requester = {
        ...adminData,
      };
    }

    return await this.apiService.createLinkRecord(linkRequest, client);
  }
  async createLinkUrl(
    client: ClientModel,
    userData: InboxContactDto | undefined,
    adminData: InboxAdminDto | undefined,
    contactId: string,
    adminId: string,
    supportReply: boolean,
    conversationId?: string,
    customAttributes?: { [key: string]: string }
  ) {
    const payload = await this.createLinkPayload(
      client,
      userData,
      adminData,
      contactId,
      adminId,
      supportReply,
      conversationId,
      customAttributes
    );

    return await this.apiService.createUrl(payload, false);
  }

  async sendToConversation(token: string, conversationId: string, body: any) {
    return await axios
      .post(
        `https://api.intercom.io/conversations/${conversationId}/reply`,
        body,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Intercom-Version': '2.3',
          },
        }
      )
      .catch((err) => {
        console.error('[sendToConversation][error]', err.response.data.errors);
        throw err;
      });
  }

  async createChat(token: string, contactId: string, recordingRef: string) {
    let url = baseUrl(`/recording/${recordingRef}?type=customer`);
    if (baseUrl().indexOf('ngrok') === -1) {
      url = await shorten(url).catch((error: any) =>
        console.error('[tiny][error]', error.message)
      );
    }

    const data = {
      from: {
        type: 'user',
        id: contactId,
      },
      body: `Hey! 👋 I've submitted a video. Could you help me? 📹 Here is the video: ${url}`,
    };

    // TODO(Joao): _intercom
    // Remove hardcoded version
    const apiResponse = await axios.post(
      'https://api.intercom.io/conversations/',
      data,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Intercom-Version': '2.3',
        },
      }
    );

    return apiResponse.data?.conversation_id;
  }

  async sendSupportReply(
    token: string,
    adminId: string,
    conversationId: string,
    recordingId: string,
    message?: string,
    audioUrl?: string
  ) {
    const body = {
      message_type: 'comment',
      type: 'admin',
      admin_id: adminId,
      body: `<div>
        <h2>🆕 Support Reply</h2>
        ${
          message
            ? `<div><b>📝 Note:</b></div>
            <div>${message}</div>`
            : audioUrl
            ? `<div><b>📝 Note:</b></div>
              <div>🔗 Voice memo attached</div>`
            : ''
        }
        <div><a href="${baseUrl(
          `/recording/${recordingId}?type=customer`
        )}" target="_blank">📹 Watch reply</a></div>
      <div>`,
    };

    return await this.sendToConversation(token, conversationId, body);
  }

  async sendRecordingInChat(
    token: string,
    conversationId: string,
    contactId: string,
    recordingRef: string
  ) {
    const body = {
      message_type: 'comment',
      type: 'user',
      intercom_user_id: contactId,
      body: `<div>
        <div>Hey! 👋 I've submitted a <a href="${baseUrl(
          `/recording/${recordingRef}?type=customer`
        )}">video</a>. Could you help me?</div>
      </div>`,
    };

    return await this.sendToConversation(token, conversationId, body);
  }
  async replyToChat(
    token: string,
    adminId: string,
    conversationId: string,
    watchUrl: string,
    message?: string,
    audioUrl?: string
  ) {
    const body = {
      message_type: 'note',
      type: 'admin',
      admin_id: adminId,
      body: `<div>
        <h2>🆕 Video Inquiry</h2>
        ${
          message
            ? `<div><b>📝 Note:</b></div>
            <div>${message}</div>`
            : audioUrl
            ? `<div><b>📝 Note:</b></div>
              <div>🔗 Voice memo attached</div>`
            : ''
        }
        <div><a href="${watchUrl}" target="_blank">📹 Watch video</a></div>
      </div>`,
    };

    return await this.sendToConversation(token, conversationId, body);
  }

  async submitConversation(body: SubmitBodyDto) {
    let token;
    // TODO(Joao): _intercom better check maybe?, to avoid hardcoded
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      token = this.intercomAccessToken;
    } else {
      const intercom = await this.databaseService.getIntercomByClientId(
        body.clientId
      );
      if (intercom?.data === undefined) {
        console.error(
          `[intercom/submitConversation] Client ID doesn't have intercom: ${body.clientId}`
        );
        throw new BadRequestException('Intercom ID is not in database');
      }
      token = intercom.data.accessToken;
    }

    const dbRecording = await this.databaseService.getRecordingByUuid(
      body.recordingId
    );

    if (dbRecording === undefined) {
      console.log(
        `[intercom/submitConversation] Recording ID not found: ${body.recordingId}`
      );
      throw new BadRequestException('Recording ID not found');
    }

    const recordingRef = dbRecording.docRef;
    const watchUrl = await this.apiService.generateWatchUrl(
      body.clientId,
      dbRecording.data.id,
      'support',
      dbRecording.data.requester?.email as string | undefined
    );

    if (
      body.reservedMetadata.intercomConversationId &&
      body.reservedMetadata.intercomSupportReply
    ) {
      // Send support reply to chat
      await this.sendSupportReply(
        token,
        body.reservedMetadata.intercomAdminId,
        body.reservedMetadata.intercomConversationId,
        recordingRef,
        body.recording.message,
        body.recording.audioUrl
      );
    } else if (body.reservedMetadata.intercomConversationId) {
      // Send video to existing
      await this.sendRecordingInChat(
        token,
        body.reservedMetadata.intercomConversationId,
        body.reservedMetadata.intercomContactId,
        recordingRef
      );
      await this.replyToChat(
        token,
        body.reservedMetadata.intercomAdminId,
        body.reservedMetadata.intercomConversationId,
        watchUrl,
        body.recording.message,
        body.recording.audioUrl
      );
    } else {
      // No conversationId, we need to create chat
      // based on ID of contact and send video to it
      const conversationId = await this.createChat(
        token,
        body.reservedMetadata.intercomContactId,
        recordingRef
      );
      await this.replyToChat(
        token,
        body.reservedMetadata.intercomAdminId,
        conversationId,
        watchUrl,
        body.recording.message,
        body.recording.audioUrl
      );
    }
  }

  async status(workspaceId: string) {
    console.error('[intercom][status]', workspaceId);
    await axios({
      method: 'POST',
      url: 'https://api.intercom.io/app_install/status',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer dG9rOjZmYTQ4MDNmX2U2NmZfNGFhM19iYjU3X2FiY2NhNTBkYmZjZjoxOjA=`,
      },
      data: {
        state: 'OK',
        message: 'Re-install videosupport to get the newest changes.',
        cta_type: 'REINSTALL_CTA',
        cta_label: 'Re-install',
        cta_url: `${baseUrl('/intercom/auth')}`,
      },
    }).catch((err) => {
      console.error('[intercom][status]', err.response.data.errors);
      throw new BadRequestException();
    });
    return {
      status: 'intercom',
      email: 'sent',
    };
  }

  async initializeInbox(req: InitializeInboxDto) {
    const admin = req.admin;
    const contact = req.contact;
    const conversation = req.conversation;

    const client = await this.databaseService.getClientByIntercomId(
      req.workspaceId
    );

    if (client?.data === undefined) {
      console.error(
        `Intercom ID doesn't match client in database: ${req.workspaceId}`
      );
      throw new BadRequestException('Client is not in database');
    }

    if (!this.accountService.verifyClient(client.data)) {
      // TODO(Joao): _intercom
      // Unauthorized, return error
    }

    if (admin?.email) {
      let existingUser = await this.databaseService.getUserByEmail(admin.email);

      if (existingUser?.data === undefined) {
        const photo = '';
        const organizationRole = 'member';
        const newUser = new UserModel(
          v4(),
          admin.name || '',
          admin.email,
          photo,
          client.data.id,
          organizationRole,
          true
        );
        await Promise.all([
          this.databaseService.createUser(newUser),
          this.databaseService.incrementClientSeats(client.data.id, 1),
        ]);
      }
    }
    // First get all recordings associated with that e-mail
    const contactRecPromise =
      this.databaseService.getRecordingsByIntercomContactId(
        client.data.id,
        contact.id
      );

    let allRecordings;
    if (contact.email && contact.email !== '') {
      const emailRecPromise = this.databaseService.getRecordingsByCustomerEmail(
        client.data.id,
        contact.email
      );
      const [emailRecordings, contactRecordings] = await Promise.all([
        emailRecPromise,
        contactRecPromise,
      ]);
      allRecordings = emailRecordings
        ? contactRecordings.concat(emailRecordings)
        : contactRecordings;
    } else {
      allRecordings = await contactRecPromise;
    }

    // Filter recordings such that we don't display duplicates
    let uniqueVideoIds = new Set<string>();

    allRecordings = allRecordings.filter((recording) => {
      if (!uniqueVideoIds.has(recording.data.id)) {
        uniqueVideoIds.add(recording.data.id);
        return true;
      }
      return false;
    });

    const maxVideosDisplay = 15;

    const recordings: any = await Promise.all(
      allRecordings
        .sort(
          (a, b) => b.data.recording.recordedAt - a.data.recording.recordedAt
        )
        .slice(0, maxVideosDisplay)
        .map(async (item, index) => {
          const recordingDate = moment(item.data.recording.recordedAt).format(
            'DD/MM/YY – HH:mm'
          );
          return {
            type: 'item',
            id: `list-item-recording-${allRecordings.length - index}`,
            title: `Recording ${allRecordings.length - index}`,
            subtitle: `${recordingDate}`,
            image: item.data.recording.thumbnailUrl,
            image_width: 48,
            image_height: 48,
            action: {
              type: 'url',
              url: await this.apiService.generateWatchUrl(
                client.data.id,
                item.data.id,
                'support',
                admin?.email
              ),
            },
          };
        })
    );

    let items;
    if (recordings.length !== 0) {
      items = recordings;
    } else {
      items = [
        {
          type: 'item',
          id: 'list-item-no-recording',
          title: 'No videosupports available',
          disabled: true,
        },
      ];
    }

    const customerName = contact.name || 'Visitor';

    let actionUrl = await this.createLinkUrl(
      client.data,
      contact,
      admin,
      contact.id,
      admin.id,
      true,
      conversation.id
    );

    return this.canvasReplyWithVideosupport(actionUrl, customerName, items);
  }

  //------------------------------------------------------------
  // Intercom responses
  // We keep these widgets separately to avoid polluting the logic
  // of the code
  //------------------------------------------------------------
  canvasReplyWithVideosupport(
    actionUrl: string,
    customerName: string,
    items: any
  ) {
    return {
      canvas: {
        content: {
          components: [
            {
              type: 'divider',
            },
            {
              type: 'text',
              text: 'Reply with a videosupport',
              style: 'header',
              align: 'center',
            },

            {
              type: 'text',
              text: 'Your reply will be sent straight to the conversation.',
              style: 'muted',
              align: 'center',
            },
            {
              type: 'button',
              id: 'video-record-button',
              label: '📹 Send recording',
              style: 'primary',
              action: {
                type: 'url',
                url: actionUrl,
              },
            },
            {
              type: 'spacer',
              size: 's',
            },
            {
              type: 'divider',
            },
            {
              type: 'text',
              text: `All videos by ${customerName}`,
              style: 'header',
              align: 'center',
            },
            {
              type: 'spacer',
              size: 's',
            },
            {
              type: 'list',
              items: items,
            },
          ],
        },
      },
    };
  }

  canvasReadyToHelp(
    titleCopy: string | undefined,
    customerSide: boolean,
    descriptionCopy: string | undefined,
    actionUrl: string,
    buttonCopy: string | undefined
  ) {
    return {
      content: {
        components: [
          {
            type: 'text',
            text: titleCopy || "We're ready to help you 🤩",
            style: 'header',
            align: 'center',
          },
          {
            type: 'list',
            disabled: !customerSide,
            items: [
              {
                type: 'item',
                id: 'list-item-videosupport',
                title: 'Videosupport.io',
                subtitle:
                  descriptionCopy ||
                  'Get help fast & easy. Share a video recording in just a few seconds. ✌️',
                image: `${baseUrl('/assets/intercom/videosupport-logo.png')}`,
                image_width: 48,
                image_height: 48,
                action: {
                  type: 'url',
                  url: actionUrl,
                },
              },
            ],
          },
          {
            type: 'spacer',
            size: 's',
          },
          {
            type: 'button',
            id: 'video-record-button',
            label: buttonCopy || '📹 Start recording',
            style: 'primary',
            action: {
              type: 'url',
              url: actionUrl,
            },
            disabled: !customerSide,
          },
        ],
      },
    };
  }

  canvasCreateWidget() {
    return {
      canvas: {
        content: {
          components: [
            { type: 'divider' },
            {
              type: 'spacer',
              size: 'xs',
            },
            {
              type: 'text',
              text: 'Create widget',
              style: 'header',
              align: 'left',
            },
            {
              type: 'text',
              text: 'None of the fields are required.',
              style: 'muted',
              align: 'left',
            },
            {
              type: 'spacer',
              size: 'xs',
            },
            {
              type: 'input',
              id: 'frame_title',
              label: 'Title',
              placeholder: "We're ready to help you. 🤩",
            },
            {
              type: 'textarea',
              id: 'frame_description',
              label: 'Description',
              placeholder:
                'Get help fast & easy. Share a video recording in just a few seconds. ✌️',
            },
            {
              type: 'input',
              id: 'frame_button',
              label: 'Call to action',
              placeholder: '📹 Start recording',
            },
            {
              type: 'spacer',
              size: 'm',
            },
            {
              type: 'button',
              id: 'configure_submit',
              label: 'Submit',
              style: 'primary',
              action: {
                type: 'submit',
              },
            },
          ],
        },
      },
    };
  }

  canvasUpgradeAccount() {
    return {
      canvas: {
        content: {
          components: [
            {
              type: 'text',
              text: 'Upgrade your account',
              style: 'header',
              align: 'left',
            },
            {
              type: 'image',
              url: 'https://app.videosupport.io/assets/intercom/update-required.png',
              height: 190,
              width: 530,
              action: {
                type: 'url',
                url: 'https://videosupport.io',
              },
            },
            {
              type: 'text',
              text: "You don't have an active plan with Videosupport. Click the button below to update your plan.",
              style: 'paragraph',
              align: 'left',
            },
            {
              type: 'button',
              id: 'video-record-button',
              label: '📮 Contact Support',
              style: 'primary',
              action: {
                type: 'url',
                url: 'https://app.videosupport.io/account/team',
              },
            },
          ],
        },
      },
    };
  }

  canvasUnauthorizedAgent() {
    return {
      content: {
        components: [
          {
            type: 'image',
            url: 'https://app.videosupport.io/assets/intercom/videosupport-dark@2x.png',
            height: 20,
            width: 125,
            align: 'center',
            action: {
              type: 'url',
              url: 'https://videosupport.io',
            },
          },
          { type: 'spacer', size: 'xs' },
          {
            type: 'divider',
          },
          {
            type: 'text',
            text: 'Unauthorised support agent',
            style: 'header',
            align: 'center',
          },
          {
            type: 'text',
            align: 'center',
            text: 'Your team ran out of seats.',
            style: 'error',
          },
          {
            type: 'text',
            align: 'center',
            text: 'Upgrade your [videosupport.io](https://videosupport.io)-account or click the button below to upgrade your account.',
            style: 'error',
          },
          { type: 'spacer', size: 'xs' },
          {
            type: 'text',
            align: 'center',
            text: 'Please do not sent this to your client.',
            style: 'muted',
          },
          { type: 'spacer', size: 'xs' },
          {
            type: 'button',
            id: 'video-record-button',
            label: '📮 Upgrade account',
            style: 'primary',
            action: {
              type: 'url',
              url: 'https://app.videosupport.io/account/team',
            },
          },
        ],
      },
    };
  }
}
