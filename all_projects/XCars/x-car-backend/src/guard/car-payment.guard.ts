import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { QuotationStatus } from '@prisma/client';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarPaymentGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const { user } = ctx.getContext().req;

      const args = ctx.getArgs(); // Get the arguments from the context
      const carId = args.carId; // Access the specific argument you want

      if (!carId) {
        // Allow access if no carId is found in the metadata
        return true;
      }

      const paymentDetails = await this.prismaService.quotation.findFirst({
        where: {
          carId: carId,
          quotationStatus: QuotationStatus.ACTIVE,
        },
        include: {
          invoiceRecord: true,
          adminDetail: true,
        },
      });

      // If user exists and payment details are valid, allow access
      if (user && paymentDetails?.invoiceRecord) {
        return true;
      } else {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          ErrorMessage.pending('Payment'),
        );
      }
    } catch (error) {
      console.log(error);
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        ErrorMessage.pending('Payment'),
      );
    }
  }
}
