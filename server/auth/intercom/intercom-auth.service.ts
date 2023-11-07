import { IntercomProfile } from 'passport-intercom';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntercomAuthService {
  validateInstallation(accessToken: string, profile: IntercomProfile) {
    return {
      id: profile.id,
      workspaceId: profile._json.app.id_code,
      name: profile.displayName,
      accessToken,
      email: profile.emails?.[0].value || '',
      photo: profile.photos?.[0].value || '',
      has_inbox_seat: profile._json.has_inbox_seat,
    };
  }
}
