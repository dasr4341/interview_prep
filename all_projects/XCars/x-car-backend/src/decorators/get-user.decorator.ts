import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.getArgByIndex(2);
    const request = context.req;
    return request.user;
  },
);
