import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CustomerMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const request = req as any;
    const { customerId } = request.session || {};

    if (customerId) {
      request.customerId = customerId;
    }

    next();
  }
}
