import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from './custom-error-filter';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from './prisma-error-filter';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    let errorMessage = exception?.message;
    if (
      exception.message?.includes('File truncated') ||
      exception.message?.includes('exceeds the')
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
          message: 'File size exceeds the maximum allowed limit of 50 MB.',
        },
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
      // to catch validation errors
    } else if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      errorMessage =
        typeof responseBody === 'string'
          ? responseBody
          : (responseBody as any)?.message || exception.message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage =
        PrismaErrors[exception.code as keyof typeof PrismaErrors] ||
        'An unknown database error occurred.';
      console.log('This is exception code: ', errorMessage);
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      errorMessage = 'An unknown error occurred during the request.';
    } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
      errorMessage = 'Internal server error. Please try again later.';
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      errorMessage = 'Failed to initialize database connection.';
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      errorMessage = 'Validation error. Please check the input data.';
    } else if (exception?.response) {
      errorMessage = exception.response.message;
      if (Array.isArray(exception.response.message.length)) {
        errorMessage = exception.response.message.join(',');
      }
    }

    this.logger.error(`Exception: ${errorMessage}, stack: ${exception.stack} `);
    throw new CustomError(
      exception.extensions?.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage ?? 'Something Went Wrong',
    );
  }
}
