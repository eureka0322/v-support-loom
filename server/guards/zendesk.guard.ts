import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { verify } from 'jsonwebtoken';

// A guard that verifies that the request came from Zendesk
@Injectable()
export class ZendeskGuard implements CanActivate {
  zendeskPublicKey: string;

  constructor(readonly manifestService: ConfigService) {
    this.zendeskPublicKey = manifestService.getString(
      'ZENDESK_PUBLIC_KEY',
      false
    );
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.body.token) {
      try {
        const _res = verify(request.body.token, this.zendeskPublicKey);
        return true;
      } catch (err) {
        return false;
      }
    } else {
      console.error('[ZendekGuard] No token provided');
      return false;
    }
  }
}
