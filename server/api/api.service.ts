import {
  BadRequestException,
  Inject,
  forwardRef,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Client } from '../database/client/client.model';
import { RequestLinkDto } from './dtos/link-request.dto';
import { baseUrl, videoUrl } from '../utils';
import { v4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import axios from 'axios';
import { PostmarkService } from '../postmark/postmark.service';
import { ApiListVideosInclusiveDto } from './dtos/list-videos.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ApiService {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly postmarkService: PostmarkService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async findClient(clientId: string) {
    return await this.databaseService.getClientByClientId(clientId);
  }

  async generateWatchUrl(
    clientId: string,
    recordingId: string,
    side: 'support' | 'customer',
    agent?: string
  ) {
    const recording = await this.databaseService.getRecordingByUuid(
      recordingId
    );
    if (!recording) {
      throw new BadRequestException(`Recording doesn't exist`);
    }
    if (recording.data.clientId !== clientId) {
      throw new UnauthorizedException(`Recording doesn't belong to client`);
    }
    let payload: any = {
      clientId,
      recordingId,
      side,
    };
    if (agent) payload = { ...payload, agent };
    const jwt = await this.authService.signPayload(payload, 'agent');
    return baseUrl(`recording/${recordingId}?token=${jwt}`);
  }

  async listAllVideos(clientId: string, agentEmail: string, maxVideos: number) {
    let recordings = await this.databaseService.getRecordings(
      clientId,
      maxVideos
    );
    const videos = await Promise.all(
      recordings
        .map((rec) => rec.data)
        .map(async (rec) => {
          return {
            watchUrl: await this.generateWatchUrl(
              clientId,
              rec.id,
              'support',
              agentEmail
            ),
            ...rec,
          };
        })
    );

    return {
      results: videos,
    };
  }

  async listMatchingVideos(clientId: string, query: ApiListVideosInclusiveDto) {
    let recordings = await this.databaseService.getRecordingsMatching(
      clientId,
      query.match
    );

    const maxVideosDisplay = 15;

    // Filter recordings such that we don't display duplicates
    let uniqueVideoIds = new Set<string>();

    recordings = recordings.filter((recording) => {
      if (!uniqueVideoIds.has(recording.data.id)) {
        uniqueVideoIds.add(recording.data.id);
        return true;
      }
      return false;
    });

    const videos = (
      await Promise.all(
        recordings
          .map((rec) => rec.data)
          .map(async (rec) => {
            return {
              watchUrl: await this.generateWatchUrl(
                clientId,
                rec.id,
                'support'
              ),
              ...rec,
            };
          })
      )
    )
      .sort((a, b) => b.recording.recordedAt - a.recording.recordedAt)
      .slice(0, maxVideosDisplay);

    return {
      results: videos,
    };
  }

  async listUnassignedVideos(clientId: string, agentEmail?: string) {
    const maxVideosDisplay = 15;

    let recordings = await this.databaseService.getRecordingsUnassigned(
      clientId,
      maxVideosDisplay
    );

    return {
      results: await Promise.all(
        recordings.map(async (rec) => {
          return {
            watchUrl: await this.generateWatchUrl(
              clientId,
              rec.id,
              'support',
              agentEmail
            ),
            ...rec,
          };
        })
      ),
    };
  }

  async updateRecordingMetadata(
    recordingRefId: string,
    metadata: { [key: string]: string | number | boolean }
  ) {
    await this.databaseService.updateRecordingMetadata(
      recordingRefId,
      metadata
    );
  }

  async updateRecordingReservedMetadata(
    recordingRefId: string,
    reservedMetadata: { [key: string]: string | number | boolean }
  ) {
    await this.databaseService.updateRecordingReservedMetadata(
      recordingRefId,
      reservedMetadata
    );
  }

  async runHooks(linkId: string, recordingRefId: string) {
    const linkPromise = this.databaseService.getLinkById(linkId);
    const videoPromise =
      this.databaseService.getRecordingByRefId(recordingRefId);

    const [link, video] = await Promise.all([linkPromise, videoPromise]);

    if (link === undefined || video === undefined) {
      throw new InternalServerErrorException(
        "Can't find original link in database"
      );
    }

    if (link.reservedMetadata !== undefined) {
      this.updateRecordingReservedMetadata(
        recordingRefId,
        link.reservedMetadata
      );
    }

    if (link.metadata !== undefined) {
      this.updateRecordingMetadata(recordingRefId, link.metadata);
    }

    let hooks: any[] = link.postRecordHooks || [];

    if (link.clientId) {
      const client = await this.databaseService.getClientByClientId(
        link.clientId
      );
      if (client && client.data.settings.defaultHooks) {
        hooks.push(...Object.values(client.data.settings.defaultHooks));
      }
    }

    const payload = {
      clientId: link.clientId,
      recordingId: recordingRefId,
    };
    const token = await this.authService.signPayload(payload, 'vs-hooks');

    for (const hook of hooks) {
      axios
        .post(
          hook.url,
          {
            linkId: link.linkId,
            clientId: link.clientId,
            customerId: link.customerId,
            recordingId: video.id,
            recording: video.recording,
            metadata: link.metadata,
            reservedMetadata: link.reservedMetadata,
            customer: link.customer,
            requester: link.requester,
            customData: hook.data,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) => {
          console.error(`[Hook ${hook.name} failed]: ${err}`);
        });
    }
  }

  async sendLinkEmail(
    client: Client,
    sender: string,
    receiver: string,
    request: RequestLinkDto,
    message?: string
  ) {
    const link = await this.createLinkRequest(request, client);
    await this.postmarkService.sendLink(
      client.name,
      sender,
      receiver,
      link,
      message
    );
  }

  async createLinkRecord(origRequest: RequestLinkDto, client?: Client) {
    let request;
    if (client) {
      request = await this.updateRequestLinkFromClient(origRequest, client);
    } else {
      request = origRequest;
    }
    const customer = request.customer;
    const requester = request.requester;

    // Create a link ID
    const linkId = v4();

    const customerId: string = customer?.id || v4();

    const payload = {
      linkId: linkId,
      admin: {
        name: requester?.name,
        email: requester?.email,
        id: requester?.id,
        job_title: requester?.jobTitle,
      },
      user: {
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
      },
      branding: request.branding,
      clientId: client?.id,
      customerId: customerId,
      options: request.options,
      v2: true,
    };

    try {
      var currentDate = this.currentDate();

      await this.databaseService.createLinkRecord({
        linkId: linkId,
        currentDate: currentDate,
        clientId: client?.id,
        customerId: customerId,
        ...request,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Error adding link to database: ${err}`
      );
    }

    return payload;
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

  async createUrl(payload: any, tinyUrl: boolean) {
    const jwt = await this.authService.signPayload(payload, 'customer');

    const url = videoUrl(`record/${jwt}`);
    if (tinyUrl) {
      const tiny = await axios
        .get(`https://tinyurl.com/api-create.php?url=${url}`)
        .then((res) => {
          return res.data;
        })
        .catch((_) => {
          return url;
        });
      return tiny;
    } else {
      return url;
    }
  }

  async createLinkRequest(origRequest: RequestLinkDto, client?: Client) {
    const payload = await this.createLinkRecord(origRequest, client);

    return await this.createUrl(payload, origRequest.options?.tinyUrl || false);
  }

  async updateRequestLinkFromClient(
    requestLink: RequestLinkDto,
    client: Client
  ) {
    if (client.settings.app) {
      const branding = client.settings.app.branding;
      if (branding && requestLink.branding === undefined) {
        requestLink.branding = {
          primaryColour: branding.primary_colour,
          secondaryColour: branding.secondary_colour,
          logo: branding.logo,
        };
      }
    }

    return requestLink;
  }

  async getAllClients() {
    return await this.databaseService.getAllClients();
  }

  async recordingSelfAssign(
    clientId: string,
    recordingId: string,
    agentEmail: string
  ) {
    const recording = await this.databaseService.getRecordingByUuid(
      recordingId
    );
    if (!recording) {
      return new BadRequestException(`Recording doesn't exist`);
    }
    if (recording.data.clientId !== clientId) {
      return new UnauthorizedException(`Recording doesn't belong to client`);
    }
    if (recording.data.assigned && recording.data.assigned.status) {
      return recording.data.assigned;
    } else {
      const res = await this.databaseService.atomicUpdateRecordingAssignee(
        recordingId,
        agentEmail
      );
      this.notificationsGateway.videoAssigned(clientId, recordingId);
      return res;
    }
  }
}
