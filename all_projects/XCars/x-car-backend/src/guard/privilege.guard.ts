import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { HelperService } from 'src/helper/helper.service';
import { permissions } from 'src/privilege/privilege';

@Injectable()
export class PrivilegeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private helperService: HelperService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const privileges = this.reflector.get<number[]>(
        'privileges',
        context.getHandler(),
      );
      if (!privileges) {
        // No specific roles required, allow access
        return true;
      }

      const ctx = GqlExecutionContext.create(context);
      const { user } = ctx.getContext().req;

      if (user) {
        const role = user.role;

        const userPrivileges = permissions[role];

        if (this.helperService.isSubset(privileges, userPrivileges)) {
          return true;
        } else {
          throw new CustomError(
            StatusCodes.FORBIDDEN,
            ErrorMessage.custom('Forbidden Resource!'),
          );
        }
      }
    } catch (error) {
      throw new CustomError(
        error?.extensions?.code ?? StatusCodes.FORBIDDEN,
        error.message ?? ErrorMessage.custom('Forbidden Resource!'),
      );
    }
  }
}
