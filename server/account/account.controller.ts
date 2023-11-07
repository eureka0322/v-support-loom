import {
  Controller,
  Post,
  Get,
  Render,
  Req,
  UseGuards,
  Body,
  Session,
} from '@nestjs/common';

import { Request } from 'express';

import { ManifestService } from '../manifest/manifest.service';
import { JWTAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AccountService } from './account.service';
import { RegisterDto } from './dtos/register.dto';
import { Roles } from 'server/roles/roles.decorator';
import { RolesGuard } from 'server/guards/roles.guard';
import { ClientEmail, ClientId, SessionState } from 'server/api/api.decorator';

@Controller('account')
export class AccountController {
  constructor(
    private readonly manifestService: ManifestService,
    private readonly accountService: AccountService
  ) {}

  private getTemplateVars() {
    return {
      script: this.manifestService.get('account'),
      css: this.manifestService.get('css'),
    };
  }

  @Get('?*')
  @Render('page')
  getPage() {
    return this.getTemplateVars();
  }

  @Post('me')
  @UseGuards(JWTAuthGuard)
  getUser(@Req() req: Request) {
    console.log('[account/me]');
    return req.user;
  }

  @Post('register')
  async register(@Body() params: RegisterDto, @Session() session: any) {
    return await this.accountService.register(params.email, session);
  }

  @Post('set-password')
  @Roles('single-create-password')
  @UseGuards(JWTAuthGuard)
  @UseGuards(RolesGuard)
  async setPassword(
    @ClientEmail() email: string,
    @SessionState() state: string,
    @Body() { password }: { password: string }
  ) {
    await this.accountService.setPassword(email, password, state);
  }

  @Post('webhook')
  async weHook(@Body() req:any) {
    console.log('weHook called')
    console.log('Body = ', req)
    return req
  }

  @Post('email-login')
  async emailLogin(
    @ClientId() clientId: string,
    @Body() { email, password }: { email: string; password: string}
  ) {
    return await this.accountService.emailLogin(email, password);
  }

  @Post('crisp-email-login')
  async crispEmailLogin(
    @ClientId() clientId: string,
    @Body() { email, password, crisp_client_id, crisp_email }: { email: string; password: string; crisp_client_id:string, crisp_email:string}
  ) {
    return await this.accountService.crispEmailLogin(email, password, crisp_client_id, crisp_email);
  }

  @Post('update-password')
  async updatePassword(
    @ClientId() clientId: string,
    @ClientEmail() email: string,
    @Body() { newPassword, confirmPassword }: { newPassword: string; confirmPassword: string}
  ) {

    if(newPassword.length < 6) {
      return 'length_err'

    } else if (newPassword != confirmPassword) {
      return 'password_not_matched'

    } else {
      return await this.accountService.updatePassword(email, newPassword);
    }
  }

  @Post('get_crisp_widget_status')
  async getCrispWidgetStatus(
    @Body() {clientId, crisp_email }: {clientId: string, crisp_email: string;}
  ) {
    return await this.accountService.getUserForCrispWidget(clientId, crisp_email);
  }

  @Post('verify')
  @Roles('slack_app', 'member', 'admin')
  @UseGuards(JWTAuthGuard)
  @UseGuards(RolesGuard)
  async accountVerify(@ClientId() clientId: string) {
    const authorized = await this.accountService.verifyClientId(clientId);
    return {
      authorized,
    };
  }
}
