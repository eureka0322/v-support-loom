import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { decode, JwtPayload } from 'jsonwebtoken';
import { matchRoles } from '../roles/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string[]>(
      'roles',
      context.getHandler()
    );
    if (!requiredRole) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return matchRoles(request.role, requiredRole);
  }
}
