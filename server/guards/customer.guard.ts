import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class CustomerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('[customer guard]');
    const request = context.switchToHttp().getRequest();
    if (!request.customerId) {
      //console.log(request);
      //return false;
      return true;
    }
    return true;
  }
}
