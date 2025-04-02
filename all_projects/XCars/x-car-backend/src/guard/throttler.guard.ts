import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext): {
    req: Record<string, any>;
    res: Record<string, any>;
  } {
    if (context.getType() === 'http') {
      const httpContext = context.switchToHttp();
      return { req: httpContext.getRequest(), res: httpContext.getResponse() };
    }
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    return { req: ctx.req, res: ctx.res };
  }

  protected throwThrottlingException(): Promise<void> {
    throw new CustomError(
      StatusCodes.REQUEST_TIMEOUT,
      'Too many requests. Please try again later',
    );
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'http') {
      const httpContext = context.switchToHttp();
      const req = httpContext.getRequest();
      if (req.url === '/health') {
        return new Promise((resolve) => {
          resolve(true);
        });
      }
    }
    return super.canActivate(context);
  }
}
