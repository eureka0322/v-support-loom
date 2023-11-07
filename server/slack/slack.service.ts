import { Injectable, BadRequestException, ConsoleLogger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { AccountService } from 'server/account/account.service';
import { ApiService } from 'server/api/api.service';
import { DatabaseService } from 'server/database/database.service';
import { User as UserModel } from 'server/database/users/users.model';
import { v4 } from 'uuid';
import * as moment from 'moment';

@Injectable()
export class SlackService {
  constructor(
    private readonly apiService: ApiService,
    private readonly accountService: AccountService,
    private readonly databaseService: DatabaseService
  ) {}

  async sendToChannel(
    clientId: string,
    recordingId: string,
    channelId: string,
    extraMetadata?: string[]
  ) {
    const botToken = await this.databaseService.getSlackTokenFromClientId(
      clientId
    );
    if (!botToken) {
      const msg = `Client ID ${clientId} doesn't have Slack bot token`;
      console.error(msg);
      throw new BadRequestException(msg);
    }

    const client = new WebClient(botToken);
    const recording = await this.databaseService.getRecordingByUuid(
      recordingId
    );

    try {
      const videoUrl = await this.apiService.generateWatchUrl(
        clientId,
        recordingId,
        'support',
        recording?.data.requester?.email as string | undefined
      );
      const customerIdentifier =
        recording?.data.customer?.name || recording?.data.customer?.email || '';
      const requesterIdentifier =
        recording?.data.requester?.name ||
        recording?.data.requester?.email ||
        '';
      const fromWhom =
        customerIdentifier === '' ? '' : `from ${customerIdentifier}`;
      const sectionFrom =
        customerIdentifier === '' ? '' : `*From:*\n${customerIdentifier}\n\n`;
      const sectionTo =
        requesterIdentifier === ''
          ? ''
          : `*Assigned:*\n${requesterIdentifier}\n\n`;
      const timestamp = recording?.data.recording.recordedAt as number;
      const sectionWhen = `*When:*\n${moment(timestamp).format(
        'DD/MM'
      )}  ${moment(timestamp).format('HH:mm')}\n\n`;
      const sectionMessage =
        recording?.data.recording.message === ''
          ? ''
          : `*Note:*\n${recording?.data.recording.message}\n\n`;
      let sectionExtraMetadata = '';
      if (extraMetadata && recording?.data.metadata) {
        const formatKey = (key: string) => {
          const lower = key.toLowerCase();
          const trimmed = lower.trim();
          const noSpaces = trimmed.replace(/ /g, '_');
          return noSpaces;
        };
        const formattedMetadata: Record<string, string> = Object.entries(
          recording.data.metadata
        ).reduce(
          (obj, [key, value]) => ({
            ...obj,
            [formatKey(key)]: value,
          }),
          {}
        );
        for (const metadata of extraMetadata) {
          const fmtMeta = formatKey(metadata);
          if (fmtMeta in formattedMetadata) {
            sectionExtraMetadata = sectionExtraMetadata.concat(
              `*${metadata}*:\n${formattedMetadata[fmtMeta]}\n\n`
            );
          }
        }
      }
      const fallbackMessage = 'You received a new Videosupport!';
      let elements: any[] = [
        {
          type: 'button',
          action_id: 'primary_subscription_button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Watch video',
          },
          style: 'primary',
          url: videoUrl,
        },
      ];
      if (recording?.data.reservedMetadata?.secondaryButton) {
        const text = recording.data.reservedMetadata.secondaryButtonText;
        const url = recording.data.reservedMetadata.secondaryButtonUrl;
        elements.push({
          type: 'button',
          action_id: 'secondary_subscription_button',
          text: {
            type: 'plain_text',
            emoji: true,
            text,
          },
          url,
        });
      }
      await client.chat.postMessage({
        channel: channelId,
        text: fallbackMessage,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `📽 New videosupport ${fromWhom}`,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `\n\n${sectionFrom}${sectionTo}${sectionWhen}${sectionMessage}${sectionExtraMetadata}`,
            },
            accessory: {
              type: 'image',
              image_url: recording?.data.recording.thumbnailUrl,
              alt_text: 'Video thumbnail',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'actions',
            elements,
          },
        ],
      });
    } catch (e) {
      console.error(`Couldn't send slack message`);
      console.error(e);
    }
  }

  async checkSameClientId(users: any[]) {
    let dbUsersProm = [];
    for (const user of users) {
      if (
        !user.is_bot &&
        !user.deleted &&
        user.profile &&
        user.profile.email &&
        user.profile.email !== ''
      ) {
        const dbUser = this.databaseService.getUserByEmail(user.profile.email);
        dbUsersProm.push(dbUser);
      }
    }
    const dbUsers = await Promise.all(dbUsersProm);
    const existingUsers = dbUsers.filter((user) => user);
    if (existingUsers.length > 0) {
      const firstOrgId = existingUsers[0]?.data.organizationId;
      for (const existingUser of existingUsers) {
        if (existingUser?.data.organizationId !== firstOrgId) {
          return {
            same: false,
          };
        }
      }
      return {
        same: true,
        clientId: firstOrgId,
      };
    }
    return {
      same: false,
    };
  }

  async install(
    chosenClientId: string,
    companyName: string,
    teamId: string,
    botToken: string,
    installationPayload: any
  ) {
    if (await this.databaseService.getClientBySlackTeamId(teamId)) {
      // Client already has slack installed, do nothing
      return;
    }

    const client = new WebClient(botToken);
    const users = await client.users.list();

    if (users?.members) {
      let clientId;
      const res = await this.checkSameClientId(users.members);
      if (res.same) clientId = res.clientId as string;
      else clientId = chosenClientId;

      let membersPromise = [];
      for (const user of users.members) {
        if (
          !user.is_bot &&
          !user.deleted &&
          user.profile &&
          user.profile.email &&
          user.profile.email !== ''
        ) {
          const role = user.is_admin ? 'admin' : 'member';
          const hasSeat = true;
          const dbUser = await this.databaseService.getUserByEmail(
            user.profile.email
          );
          if (!dbUser) {
            const promise = this.databaseService.createUser(
              new UserModel(
                v4(),
                user.profile?.display_name || '',
                user.profile.email,
                user.profile?.image_original || '',
                clientId,
                role,
                hasSeat
              )
            );
            membersPromise.push(promise);
          }
        }
      }
      const seats = membersPromise.length;
      await Promise.all(membersPromise);
      await this.databaseService.createSlack(teamId, installationPayload);

      const existingClient = await this.databaseService.getClientByClientId(
        clientId
      );
      if (existingClient) {
        await this.databaseService.addIntegrationToClient(clientId, 'slack', {
          teamId,
        });
        await this.databaseService.incrementClientSeats(clientId, seats);
      } else {
        await this.accountService.createAccount({
          id: clientId,
          companyName,
          plan: 'prepricing',
          integrations: {
            slack: {
              teamId,
            },
          },
          seats,
          referrerUrl: 'https://videosupport.io',
          subscriptionType: 'trial',
        });
      }
    } else {
      console.error(
        `New Slack installation couldn't be completed: can't get users`
      );
      console.error(users.error);
    }
  }
}
