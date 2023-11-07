import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntercomAuthGuard extends AuthGuard('intercom') {
  // This will use the intercom passport implementation under '../auth/intercom'.
}
