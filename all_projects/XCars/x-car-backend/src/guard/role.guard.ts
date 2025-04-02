import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        // No specific roles required, allow access
        return true;
      }
      const ctx = GqlExecutionContext.create(context);
      const { user } = ctx.getContext().req;
      if (user && roles.includes(user.role)) {
        return true;
      } else {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          ErrorMessage.custom('Forbidden Resource!'),
        );
      }
    } catch (error) {
      throw new CustomError(
        error?.extensions?.code ?? StatusCodes.FORBIDDEN,
        error.message ?? ErrorMessage.custom('Forbidden Resource!'),
      );
    }
  }
}
