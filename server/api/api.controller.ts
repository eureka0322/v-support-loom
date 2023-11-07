import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { v4 } from 'uuid';
import { User as UserModel } from '../database/users/users.model';
import { ApiListVideosInclusiveDto } from './dtos/list-videos.dto';
import { ApiRequestLinkDto } from './dtos/link-request.dto';
import { ApiSendLinkEmailDto } from './dtos/send-link-email.dto';
import { GenerateWatchUrlDto } from './dtos/generate-watch-url.dto';
import { RunHooksDto } from './dtos/run-hooks.dto';
import { AgentEmail, ClientId, RecordingId } from './api.decorator';
import { ApiGuard } from '../guards/api.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Crisp } from 'crisp-api';
import { ConfigService } from '../config/config.service';
import { DatabaseService } from '../database/database.service';

@Controller('api')
export class ApiController {
  client: any;

  constructor(private readonly apiService: ApiService,
    configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {

    this.client = new Crisp();
    const crispId = configService.getString('CRISP_ID', false);
    const crispSecret = configService.getString('CRISP_SECRET', false);
    this.client.authenticateTier('plugin', crispId, crispSecret);
  }

  @Get('hooks/run')
  async runHooks(@Query() query: RunHooksDto) {
    const { linkId, videoRefId } = query;
    return this.apiService.runHooks(linkId, videoRefId);
  }

  @Post('email/link')
  @Roles('admin', 'member')
  //@UseGuards(ApiGuard)
  //@UseGuards(RolesGuard)
  async sendEmailLink(
    @ClientId() clientId: string,
    @Body() query: ApiSendLinkEmailDto
  ) {
    const client = await this.apiService.findClient(clientId);
    if (client?.data === undefined) {
      console.error('[api/email/link] Client not found');
      throw new BadRequestException('Client not found');
    }

    return this.apiService.sendLinkEmail(
      client.data,
      query.senderEmail,
      query.receiverEmail,
      query
    );
  }

  @Post('create/link')
  @Roles('admin', 'member', 'slack_app')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async createLinkRequest(
    @ClientId() clientId: string,
    @Body() query: ApiRequestLinkDto
  ) {
    const client = await this.apiService.findClient(clientId);
    if (client?.data === undefined) {
      console.error('[api/create/link] Client not found');
      throw new BadRequestException('Client not found');
    }
    return this.apiService.createLinkRequest(query, client.data);
  }

  @Post('open/create/link')
  async openCreateLinkRequest(@Body() query: ApiRequestLinkDto) {
    return this.apiService.createLinkRequest(query);
  }

  @Post('videos/all')
  @Roles('admin', 'member', 'slack_app')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async listAllVideos(
    @ClientId() clientId: string,
    @Body() query: { agentEmail: string; maxVideos: number }
  ) {
    return await this.apiService.listAllVideos(
      clientId,
      query.agentEmail,
      query.maxVideos
    );
  }

  @Post('videos/match')
  @Roles('admin', 'member', 'slack_app')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async listMatchingVideos(
    @ClientId() clientId: string,
    @Body() query: ApiListVideosInclusiveDto
  ) {
    return await this.apiService.listMatchingVideos(clientId, query);
  }

  @Post('videos/unassigned')
  @Roles('admin', 'member', 'slack_app')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async videosUnassigned(
    @ClientId() clientId: string,
    @Body() { agentEmail }: { agentEmail?: string }
  ) {
    return this.apiService.listUnassignedVideos(clientId, agentEmail);
  }

  @Post('generate-watch-url')
  @Roles('admin', 'member')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async generateWatchUrl(
    @ClientId() clientId: string,
    @Body() { recordingId, side, agent }: GenerateWatchUrlDto
  ) {
    return await this.apiService.generateWatchUrl(
      clientId,
      recordingId,
      side,
      agent
    );
  }
  @Post('recording/self-assign')
  @Roles('admin', 'member', 'agent')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  async recordingSelfAssign(
    @ClientId() clientId: string,
    @RecordingId() recordingId: string,
    @AgentEmail() agentEmail: string
  ) {
    return await this.apiService.recordingSelfAssign(
      clientId,
      recordingId,
      agentEmail
    );
  }

  @Get('cron/add/operators')
  async cronAddOperators(@Body() query: ApiRequestLinkDto) {
    try {

      /*var websiteId =  '5da853d2-e408-4ab9-bc59-69ba9a788c66'
      var clientId = '3aa1c8c7-8fb2-4902-8207-211773c5d6ce'
      var operators = await this.getOperators(clientId, websiteId);
      return*/

      const clients = await this.apiService.getAllClients();
      console.log('*********************  process start   *********************************')
      console.log('client length= ', clients.length)

      if(clients.length > 0) {

        var i = 1;

        clients.forEach(async element => {
          var clientId = element.data.id;
          var websiteId = element.data.settings.integrations.crisp.websiteId;

          await this.getOperators(clientId, websiteId)
          console.log('counter -------------------------- ', i);
          console.log('clientId = ', clientId)
          console.log('websiteId = ', websiteId)
          i++;

          console.log('--------------------------');
          
        });
      }
    } catch(error) {
      console.log('error = ', error)
    }
  }

  async getOperators(clientId:string, websiteId:string) {

    try {

      var operators = await this.client.website.listWebsiteOperators(websiteId);
      console.log('website operators = ', operators)

      if(operators.length > 0) {

        var user_data = await this.addOperators(clientId, operators);

      } else {
        console.log('operators not found for websiteId ------- ', websiteId)
      }

    } catch(error) {

      console.log('getOperators for website = ', websiteId)
      console.log('getOperators error = ', error)
    }
  }

  async addOperators(clientId: string, operators: any[]) {

    var j = 1;
    const photo = '';
    const hashedPassword = ''

    for (const operator of operators) {
      console.log('j operators -----------------------------', j)
      j++

      console.log('operator = ', operator)
      const userInDb = await this.databaseService.getUserByEmail(
        operator.details.email
      );
      console.log('userInDb = ', userInDb)
      //if (operator.type === 'operator' && userInDb === undefined) {
      if (userInDb === undefined) {

        const name = operator.details.first_name + ' ' + operator.details.last_name;

        const organizationRole = operator.details.role === 'owner' ? 'admin' : 'member';

        const email = operator.details.email;

        //const hasSeat = true;
        // on intallation only admin seat is approved, admin will give the seat to member from website.
        var hasSeat = false;
        if(organizationRole == 'admin') {
          hasSeat = true;
        }

        var crisp_client_id = clientId

        await this.databaseService.createUser(
          new UserModel(
            v4(),
            name,
            email,
            photo,
            clientId,
            organizationRole,
            hasSeat,
            hashedPassword,
            crisp_client_id
          )
        );
        console.log('user created for = ', email)
      } else {
        console.log('user already exist = ')
      }
    }
  }
}
