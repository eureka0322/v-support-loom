import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientGuard } from './client.guard';

export class AdminGuard extends ClientGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return false;
  }
}
