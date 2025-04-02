import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerServiceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const parentType = info?.parentType?.name;
    const fieldName = info?.fieldName;
    const start = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - start;
        console.log('----------------------------------------');
        console.log(
          `\x1b[35m${parentType} ==> \x1b[0mSuccess: \x1b[32m${response.success} || \x1b[0mMethod: \x1b[33m${fieldName} || \x1b[0mMessage: \x1b[36m${response.message} || \x1b[0mDuration: \x1b[31m${duration}ms `,
        );
        console.log('\x1b[0m----------------------------------------');
      }),
    );
  }
}
