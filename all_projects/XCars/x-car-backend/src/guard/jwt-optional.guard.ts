import { PrismaService } from './../prisma/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';

@Injectable()
export class JwtOptionalGuard implements CanActivate {
  constructor(
    private jwtTokenService: JwtTokenService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = await this.jwtTokenService.verifyAccessToken({ token });

      const user = await this.prismaService.user.findUnique({
        where: {
          id: decoded.sub,
        },
      });

      const admin = await this.prismaService.admin.findUnique({
        where: {
          id: decoded.sub,
        },
      });

      // const user = await this.userService.getUserById({ id: decoded.sub });

      if (user || admin) {
        req.user = user || admin;
        return true;
      }

      throw new CustomError(
        StatusCodes.UNAUTHORIZED,
        ErrorMessage.custom('Forbidden Resource!'),
      );
    } catch (error) {
      throw new CustomError(
        error?.extensions?.code ?? StatusCodes.UNAUTHORIZED,
        error.message ?? ErrorMessage.custom('Forbidden Resource!'),
      );
    }
  }
}
