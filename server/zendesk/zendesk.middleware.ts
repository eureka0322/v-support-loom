import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';

@Injectable()
export class ZendeskMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const request = req as any;
    if (request.body.token) {
      const token = request.body.token;
      const data: any = decode(token);
      const iss = data.iss;
      const subdomain = iss.slice(0, iss.indexOf('.'));

      request.subdomain = subdomain;
    }

    next();
  }
}
