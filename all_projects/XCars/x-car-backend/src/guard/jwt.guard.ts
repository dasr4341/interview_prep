import { PrismaService } from './../prisma/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { QuotationStatus, Roles, UserStatus } from '@prisma/client';
import { isAfter } from 'date-fns';
import { Application } from 'src/common/enum/application.enum';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtTokenService: JwtTokenService,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers['authorization'];
    const app = req.headers['app'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        ErrorMessage.custom('Forbidden Resource!'),
      );
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

      if (user && user.userStatus === UserStatus.DISABLED) {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          ErrorMessage.custom('Forbidden Resource!'),
        );
      }

      if (user && user.userStatus !== UserStatus.ONBOARDED) {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          ErrorMessage.custom('Forbidden Resource!'),
        );
      }

      if (user && user.role === Roles.DEALER && app !== Application.APP) {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          ErrorMessage.custom('Forbidden Resource!'),
        );
      }

      if (user && user.role === Roles.USER && app !== Application.WEB) {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          ErrorMessage.custom('Forbidden Resource!'),
        );
      }

      if (admin && admin.role === Roles.ADMIN && app !== Application.WEB) {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          ErrorMessage.custom('Forbidden Resource!'),
        );
      }

      // check dealer quotations
      if (user && user.role === Roles.DEALER) {
        const quotations = await this.prismaService.quotation.findMany({
          where: {
            dealerId: user.id,
          },
          include: {
            quotationDetails: true,
          },
        });

        if (quotations.length) {
          for (const quotation of quotations) {
            const currentDate = new Date();
            if (
              quotation?.quotationDetails?.expiryDate &&
              isAfter(currentDate, quotation?.quotationDetails?.expiryDate)
            ) {
              await this.prismaService.quotation.update({
                where: { id: quotation.id },
                data: { quotationStatus: QuotationStatus.EXPIRED },
              });
            }
          }
        }
      }

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
