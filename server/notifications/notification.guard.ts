import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { ConfigService } from 'server/config/config.service';

@Injectable()
export class WsGuard implements CanActivate {
  jwtSecret: string;

  constructor(configService: ConfigService) {
    this.jwtSecret = configService.getString('JWT_SECRET', false);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const bearer = client.handshake.headers.authorization;
    const token = bearer.split(' ')[1];
    try {
      verify(token, this.jwtSecret);
      return true;
    } catch (e) {
      return false;
    }
  }
}
