import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Customer = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.customerId;
  },
);
