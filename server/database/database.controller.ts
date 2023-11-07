import * as rawbody from 'raw-body';
import {
  UploadedFile,
  UseInterceptors,
  Post,
  Controller,
  Get,
  Param,
  BadRequestException,
  Req,
  Query,
  UseGuards,
  Body,
  UnauthorizedException,
  Delete,
  Put,
} from '@nestjs/common';

import { Request } from 'express';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { RecordingRepository } from '../database/recordings/recording.repository';
import { FeedbackRepository } from '../database/feedback/feedback.repository';
import { Feedback } from '../database/feedback/feedback.model';
import { PotentialUsersRepository } from '../database/users/potential-users.repository';
import { ROICalculation } from '../database/roicalculator/roicalculator.model';
import { ROICalculatorRepository } from '../database/roicalculator/roicalculator.repository';
import { getExtension } from 'mime';
import { diskStorage } from 'multer';
import { IntercomRepository } from '../intercom/intercom.repository';
import { AdminGuard } from '../guards/admin.guard';
import { CustomerGuard } from '../guards/customer.guard';
import { ClientGuard } from '../guards/client.guard';
import { Customer } from './decorators/customerDecorator';
import { DatabaseService } from './database.service';
import {
  RecordingAddDto,
  RecordingDescriptionDto,
} from './dtos/recording-add.dto';
import { UpdateBrandingDto } from './dtos/update-branding.dto';
import { UpdateAppReferrerDto } from './dtos/update-app-settings.dto';
import { RequestAccessDto } from './dtos/request-access.dto';
import { RolesGuard } from 'server/guards/roles.guard';
import { Roles } from 'server/roles/roles.decorator';
import { AgentEmail, ClientId, RecordingId } from 'server/api/api.decorator';



export const editFileName = (req: any, file: any, cb: any) => {
  /* get rid of extension */
  const plainFilename = file.originalname.split('.');
  const filename = `${plainFilename[0]}-${Date.now()}.${getExtension(
    file.mimetype
  )}`;
  cb(null, filename);
};

export const options = {
  storage: diskStorage({
    destination: join(__dirname, '../../public/uploads'),
    filename: editFileName,
  }),
};

@Controller('db')
export class DatabaseController {
  constructor(
    private readonly recordingRepository: RecordingRepository,
    private readonly databaseService: DatabaseService,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly roiCalculatorRepository: ROICalculatorRepository
  ) {}

  @Post('account/add-hook')
  @Roles('admin', 'slack_app')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async clientAddDefaultHook(
    @ClientId() clientId: string,
    @Body() hook: { id: string; name: string; url: string; data: any }
  ) {
    return await this.databaseService.clientAddDefaultHook(clientId, hook);
  }

  @Post('account/delete-hook')
  @Roles('admin', 'slack_app')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async clientDeleteDefaultHook(
    @ClientId() clientId: string,
    @Body() hook: { id: string }
  ) {
    return await this.databaseService.clientDeleteDefaultHook(
      clientId,
      hook.id
    );
  }

  @Post('recording/add')
  @UseGuards(CustomerGuard)
  async addRecordingToDb(@Body() body: RecordingAddDto) {
    return this.databaseService.addRecordingToDb(body);
  }

  // TODO(Joao): this is disabled for now, because we need a way to
  // identify which customer recorded the video and only provide access
  // to them
  //@UseGuards(CustomerGuard)
  @Get('customer/ref/:id')
  async ref(@Param('id') id: string) {
    return await this.databaseService.getRecordingWithValidUrl(id);
  }

  @Post('recording/check-assigned')
  @Roles('admin', 'member', 'agent')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async checkRecordingAssigned(
    @ClientId() clientId: string,
    @RecordingId() recordingId: string
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
    if (recording.data.assigned) {
      return recording.data.assigned;
    } else {
      return {
        status: false,
      };
    }
  }

  @Post('upload/logo')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', options))
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async uploadLogo(
    @ClientId() clientId: string,
    @UploadedFile() file: Array<Express.Multer.File>
  ) {
    const res = await this.databaseService.uploadLogo(clientId, file);
    return res;
  }

  @Post('hooks/compressed/update')
  async updateRecordingCompressed(@Req() req: any) {
    const raw = await rawbody(req);
    const text = raw.toString().trim();
    let body = JSON.parse(text);
    // AWS sends two types of message here, either a subscription confirmation,
    // or notification
    if (body.Type === 'SubscriptionConfirmation') {
      console.log(body.SubscribeURL);
    } else {
      body.Message = JSON.parse(body.Message);
      const mp4path =
        body.Message.detail.outputGroupDetails[1].outputDetails[0]
          .outputFilePaths[0];
      const startstr = mp4path.lastIndexOf('/') + 1;
      const id = mp4path.slice(startstr, -4);
      return await this.databaseService.updateRecordingCompressed(id);
    }
  }

  @Get('user/organization/data')
  @Roles('admin')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async userFindOrganization(@ClientId() clientId: string) {
    const org = await this.databaseService.getClientByClientId(clientId);
    return org?.data;
  }

  @Post('organization/subscription')
  @Roles('admin')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async organizationSubscription(@ClientId() clientId: string) {

    return await this.databaseService.getOrganizationSubscription(clientId);
  }

  @Post('organization/max-seats')
  @Roles('admin')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async orgMaxSeats(@ClientId() clientId: string) {
    return await this.databaseService.getOrganizationMaxSeats(clientId);
  }

  @Get('client/recordings')
  @Roles('admin', 'member')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async getRecordingsByClientId(@ClientId() clientId: string) {
    const recordings = await this.recordingRepository.getRecordingsByClientId(
      clientId
    );
    return {
      recordings: recordings,
    };
  }

  @Put('client/recordings/:id')
  @Roles('admin', 'member')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async updateRecordingById(@Param('id') id: string, @Body() updatedData: any) {
    const updatedRecording = await this.recordingRepository.updateRecordingById(id, updatedData);
    return {
      message: 'Recording updated successfully',
      recording: updatedRecording,
    };
  }

  @Delete('client/recordings/:id')
  @Roles('admin', 'member')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async deleteRecordingById(@Param('id') id: string) {
    console.log("****");
    await this.recordingRepository.deleteRecordingById(id);
    return {
      message: 'Recording deleted successfully',
    };
  }

  @Post('client/seats/update')
  @Roles('admin')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async updateUsersSeats(
    @ClientId() clientId: string,
    @Body() body: { [key: string]: boolean }
  ) {
    await this.databaseService.updateUsersSeats(clientId, body);
  }

  @Get('client/members')
  @Roles('admin')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async getClientMembers(@ClientId() clientId: string) {
    const members = await this.databaseService.getClientMembers(clientId);

    return {
      members: members,
    };
  }

  @Post('branding/update')
  @Roles('admin')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async updateBranding(
    @ClientId() clientId: string,
    @Body() req: UpdateBrandingDto
  ) {
    await this.databaseService.updateBranding(clientId, req);
    return {
      status: 'ok',
    };
  }

  @Post('customer/feedback/submit')
  @UseGuards(CustomerGuard)
  async submitUserFeedback(@Req() req: Request, @Customer() customer: string) {
    console.log('[feedback/submit]');
    const user = req.body.user;
    const integration = req.body.integration;
    const feedback = req.body.feedback;
    const feedbackText = req.body.feedbackText;
    const createdAt = req.body.createdAt;
    const feedbackModel = new Feedback(
      user,
      integration,
      feedback,
      createdAt,
      feedbackText
    );
    const feedbackRefId = await this.feedbackRepository.submitUserFeedback(
      feedbackModel
    );

    if (feedbackRefId) {
      console.log('[feedback]', feedbackRefId);
      return {
        status: 'ok',
        message: 'Feedback received',
      };
    } else {
      return {
        status: 'error',
        message: 'Unable to add feedback',
      };
    }
  }

  @Post('settings/app/plugins')
  @Roles('admin')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async settingsAppPlugins(@ClientId() clientId: string) {
    return await this.databaseService.settingsAppPlugins(clientId);
  }

  @Post('settings/app/plugins/update')
  @Roles('admin')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async settingsAppPluginsUpdate(
    @ClientId() clientId: string,
    @Body()
    body: {
      id: string;
      fieldName: string;
      value: string | string[];
    }
  ) {
    return await this.databaseService.settingsAppPluginsUpdate(clientId, body);
  }

  @Post('settings/app/referrer/update')
  @Roles('admin', 'member')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async updateAppSettings(
    @ClientId() clientId: string,
    @Body() req: UpdateAppReferrerDto
  ) {
    return await this.databaseService.updateAppSettings(clientId, req);
  }

  

  @Post('settings/user/email/update')
  @Roles('admin', 'member')
  @UseGuards(ClientGuard)
  @UseGuards(RolesGuard)
  async updateUserEmail(
    @ClientId() clientId: string,
    @Body()
    body: {
      email: string;
      newEmail: string;
    }
  ) {
    // console.log('[updateUserEmail]', body);
    const current_user = await this.databaseService.getUserByEmail(body.email);
    // console.log('current_user:', current_user);
    var new_user = await this.databaseService.getUserByEmail(body.newEmail);
    // console.log('new_user_exists:', new_user);
    if(current_user){
      // todo, check if user is the current user
      if (!new_user) {
        this.databaseService.updateUserEmailByUserId(current_user.data.id, body.newEmail);
        console.log('done');
      }
    }
    return await this.databaseService.getUserByEmail(body.newEmail);
  }

  // No guards, anyone can create roicalculator
  @Post('roicalculator/create')
  async createROICalculatorQuery(@Req() req: Request) {
    console.log('[create/roicalculator]');
    const amountOfInquiries = req.body.inquiries;
    const timeToSolution = req.body.timeToSolution;
    const costPerEmployee = req.body.costPerEmployee;
    const amountOfAgents = req.body.amountOfAgents;
    const productCategory = req.body.productCategory;
    const email = req.body.email;
    const createdAt = Date.now();
    const roiRequestModel = new ROICalculation(
      amountOfInquiries,
      timeToSolution,
      costPerEmployee,
      amountOfAgents,
      productCategory,
      email,
      createdAt
    );

    const roicalculationRefId =
      await this.roiCalculatorRepository.submitCalculation(roiRequestModel);

    if (roicalculationRefId) {
      console.log('[roicalculation]', roicalculationRefId);
      return {
        status: 'ok',
        message: 'Calculation created',
      };
    } else {
      return {
        status: 'error',
        message: 'Unable to create calculation',
      };
    }
  }

  @Post('clients/requestaccess')
  async requestCompanyAccess(@Body() req: RequestAccessDto) {
    return await this.databaseService.requestCompanyAccess(req.email);
  }
}
