import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ZendeskSubdomain = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.subdomain;
  }
);
