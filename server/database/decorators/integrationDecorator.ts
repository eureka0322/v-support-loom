import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Integration = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    // TODO(Joao): have a dedicated Integration object
    // TODO(Joao): _check_v2 userId doesn't exist anymore
    return {
      integrationName: req.integrationName,
      userId: req.userId,
    };
  },
);
