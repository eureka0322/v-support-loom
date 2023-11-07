import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { decode, JwtPayload } from 'jsonwebtoken';

export const WsClientId = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    const bearer = client.handshake.headers.authorization;
    const token = bearer.split(' ')[1];
    // Don't need to verify, which happens at guard
    const res = decode(token) as JwtPayload;
    return res.clientId;
  }
);
