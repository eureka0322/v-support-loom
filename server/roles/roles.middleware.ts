import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const request = req as any;
    if (request.headers.authorization) {
      const auth = request.headers.authorization;
      const [_bearer, token]: [string, string] = auth.split(' ');
      const { role }: any = decode(token);
      request.role = role;
    }

    next();
  }
}
