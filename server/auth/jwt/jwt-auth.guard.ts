import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  // This will use the jwt passport implementation under '../auth/jwt'.
}
