import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientId = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.clientId;
  }
);

export const RecordingId = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.recordingId;
  }
);

export const AgentEmail = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.agentEmail;
  }
);

export const ClientEmail = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.clientEmail;
  }
);

export const SessionState = createParamDecorator(
  (data: number, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.sessionState;
  }
);
