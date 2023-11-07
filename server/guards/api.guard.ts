import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/jwt/jwt-auth.guard';

// For now it's the same scope, but that can change with roles ('agent' vs 'admin')
export class ApiGuard extends JWTAuthGuard implements CanActivate {}
