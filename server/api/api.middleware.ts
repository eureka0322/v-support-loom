import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const request = req as any;
    if (request.headers.authorization) {
      const auth = request.headers.authorization;
      const [_bearer, token]: [string, string] = auth.split(' ');
      const { clientId, recordingId, agent, email, sessionState }: any =
        decode(token);
      request.clientId = clientId;
      if (recordingId) request.recordingId = recordingId;
      if (agent) request.agentEmail = agent;
      if (email) request.clientEmail = email;
      if (sessionState) request.sessionState = sessionState;
    }

    next();
  }
}
