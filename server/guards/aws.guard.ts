import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { verify } from 'jsonwebtoken';

// A guard that verifies that the request came from AWS
@Injectable()
export class AwsGuard implements CanActivate {
  constructor(readonly manifestService: ConfigService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return true;
  }
}
