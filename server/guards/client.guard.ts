import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/jwt/jwt-auth.guard';

export class ClientGuard extends JWTAuthGuard implements CanActivate {}
