import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  Param,
  Session,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { decode } from 'jsonwebtoken';

//import { S3 } from '@aws-sdk/client-s3';
import { baseUrl } from '../utils';
import { GoogleUser } from '../auth/google/google-auth.service';
import { GoogleAuthGuard } from '../auth/google/google-auth.guard';
import { IntercomAuthGuard } from '../auth/intercom/intercom-auth.guard';
import { IntercomService, IntercomUser } from '../intercom/intercom.service';
import { CustomerGuard } from '../guards/customer.guard';
import { AuthService } from './auth.service';
import { DatabaseService } from '../database/database.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly intercomService: IntercomService,
    private readonly databaseService: DatabaseService
  ) {}

  // Endpoint to authorize a customer to perform further actions
  // If the message is correctly signed, it will set a session cookie
  // for the user, who will be able to call endpoints guarded by
  // CustomerGuard
  @Get('customer/:jwt')
  async authCustomer(@Param('jwt') userJwt: string, @Session() session: any) {
    try {
      const payload = await this.authService.verify(userJwt);
      // API payload
      const { linkId, customerId } = payload;

      /* get client id by link id */

      var link_data = await this.databaseService.getLinkById(linkId);

      if(link_data) {

        console.log('link_data = ', link_data);
        var clientId = link_data.clientId;
        console.log('clientId = ', clientId);

        if(clientId){

          var user_subscription_data = await this.databaseService.getOrganizationSubscriptionCrisp(clientId);
          console.log('user_subscription data = ', user_subscription_data);

          if(user_subscription_data) {

            var subsc_name = user_subscription_data.name;

            if(subsc_name == 'Trial') { // if not trial do nothing

              console.log('user_subscription is trial chk the reccording limit');
              var user_subscription = await this.subscriptionCheck(clientId);

              if(user_subscription === false) {

                throw new UnauthorizedException("Your trial recording ilmit is over");
                return false
              }

            } else {
              console.log('user_subscription is not trial proceed further');
            }
          }
        }
      }

      /* chk is link is already recorded */
      const recording_data = await this.databaseService.checkRecordingToDb(linkId);
      if(recording_data.length > 0) {
        throw new UnauthorizedException("This link s already recorded");
        return false
      }

      // Set customerId on session to further identify that user is authorized
      // to perform customer actions
      session.customerId = customerId;
      // Check and return whether customer is authorized
      return this.authService.authorizedLink(linkId);
    } catch (err) {
      console.error(`[auth/customer] Couldn't authenticate customer: ${err}`);
      console.log(userJwt);
      throw new UnauthorizedException("Couldn't authenticate customer");
    }
  }

  async subscriptionCheck(clientId:string) {

    var recording_data = await this.databaseService.countRequestSendLink(clientId);
    var link_send_free_limit = Number(process.env.LINK_SEND_FREE_LIMIT);

    console.log('link_send_free_limit = ', link_send_free_limit);

    if(recording_data != undefined) {

      console.log('recording_data = ', recording_data.length);

      if(recording_data.length < link_send_free_limit) {
        return true
      } else {
        return false
      }
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  authGoogle() {
    console.log('[auth/google] here');
    // The 'passport-google' package redirects the user to the intercom website to authenticate.
    // We do not need to do anything here.
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async authGoogleCallback(@Res() res: Response, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const jwt = (req.user as GoogleUser).jwt!;
    if (jwt) {
      res.redirect(baseUrl(`account/overview?access_token=${jwt}`));
    } else {
      res.redirect(baseUrl('account/login'));
    }
  }

  @Get('intercom')
  @UseGuards(IntercomAuthGuard)
  authIntercom() {
    // The 'passport-intercom' package redirects the user to the intercom website to authenticate.
    // We do not need to do anything here.
  }

  @Get('intercom/callback')
  @UseGuards(IntercomAuthGuard)
  async authIntercomCallback(@Res() res: Response, @Req() req: Request) {
    // When we get here, it means the 'validate' method on 'IntercomAuthStrategy' was called. (Because of the @UseGuards decorator)
    // The request object now has the user returned from that 'validate' method.
    // The request url will also have the following query string: '?code=...&state='.

    // https://app.intercom.com/appstore/redirect?install_success=true
    // https://app.intercom.com/appstore/redirect?error_message=<your error message>

    /* ADD USER TO DATABASE */
    const intercomUser = req.user as IntercomUser;

    // Check if user is in database
    await this.intercomService.installIntercom(intercomUser);

    // Auto-redirect to workspace/app-store where you installed it from
    res.redirect(
      'https://app.intercom.com/appstore/redirect?install_success=true'
    );
  }

  @Get('s3/put/video/:id')
  @UseGuards(CustomerGuard)
  async s3PresignedPost(@Param('id') id: string) {
    return await this.authService.presignedS3PutVideo(id);
  }

  @Post('s3/multipart/add')
  //@UseGuards(CustomerGuard)
  async s3MultipartAdd(
    @Body() body: { id: string; uploadId: string; partNumber: number }
  ) {
    return await this.authService.presignedS3PutVideoPart(
      body.id,
      body.uploadId,
      body.partNumber
    );
  }

  @Post('s3/multipart/finish')
  @UseGuards(CustomerGuard)
  async s3MultipartFinish(
    @Body()
    body: {
      id: string;
      uploadId: string;
      parts: { ETag: string; PartNumber: number }[];
    }
  ) {
    return await this.authService.completeMultiPart(
      body.id,
      body.uploadId,
      body.parts
    );
  }

  @Get('s3/multipart/start/:id')
  @UseGuards(CustomerGuard)
  async s3PresignedMultipart(@Param('id') id: string) {
    return await this.authService.createMultipartS3(id);
  }

  @Get('s3/get/video/:id')
  @UseGuards(CustomerGuard)
  async s3PresignedGetVideo(@Param('id') id: string) {
    return await this.authService.presignedS3GetVideo(id);
  }

  @Get('s3/get/thumb/:id')
  @UseGuards(CustomerGuard)
  async s3GetThumb(@Param('id') id: string) {
    return await this.authService.S3GetThumb(id);
  }
}
