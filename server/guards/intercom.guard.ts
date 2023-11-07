import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

// A guard that verifies that the request came from Zendesk
@Injectable()
export class IntercomGuard implements CanActivate {
  intercomSecret: string;

  constructor(readonly manifestService: ConfigService) {
    this.intercomSecret = manifestService.getString(
      'INTERCOM_CLIENT_SECRET',
      false
    );
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const intercomSig = request.headers['x-body-signature'];
    const mySig = createHmac('sha256', this.intercomSecret)
      .update(request.rawBody)
      .digest('hex');

    const authorized = timingSafeEqual(
      Buffer.from(mySig),
      Buffer.from(intercomSig)
    );

    if (authorized) {
      return true;
    } else {
      console.error(
        `[IntercomGuard] Failed to authorize Intercom request (${intercomSig} != ${mySig}). Body:`
      );
      console.error(request.rawBody);
      return false;
    }
  }
}
