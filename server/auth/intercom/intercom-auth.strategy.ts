import { Strategy, IntercomProfile } from 'passport-intercom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '../../config/config.service';

import { IntercomAuthService } from './intercom-auth.service';

@Injectable()
export class IntercomAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly intercomAuthService: IntercomAuthService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.getString('INTERCOM_CLIENT_ID'),
      clientSecret: configService.getString('INTERCOM_CLIENT_SECRET'),
      callbackURL: configService.getString('INTERCOM_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: IntercomProfile,
  ) {
    const user = this.intercomAuthService.validateInstallation(
      accessToken,
      profile,
    );

    if (!user) {
      throw new UnauthorizedException(
        'The installation could not be completed.',
      );
    }

    return user;
  }
}
