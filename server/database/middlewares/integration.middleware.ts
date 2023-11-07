import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import decode from 'jwt-decode';

@Injectable()
export class IntegrationMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
