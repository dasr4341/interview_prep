import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appEnv } from './config/app-env';
// import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { graphqlUploadExpress } from 'graphql-upload';
import { AllExceptionFilter } from './global-filters/all-exception-filter';
import { rawBodyMiddleware } from './common/middleware/raw-body.middleware';
import { AnalyticsInterceptor } from './common/interceptor/analytics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(app.get(AnalyticsInterceptor));

  app.use('/payments/webhook', rawBodyMiddleware);

  // commented for development
  // app.use(
  //   helmet({
  //     crossOriginEmbedderPolicy: false,
  //     contentSecurityPolicy: {
  //       directives: {
  //         imgSrc: [
  //           `'self'`,
  //           'data:',
  //           'apollo-server-landing-page.cdn.apollographql.com',
  //         ],
  //         scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
  //         manifestSrc: [
  //           `'self'`,
  //           'apollo-server-landing-page.cdn.apollographql.com',
  //         ],
  //         frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
  //       },
  //     },
  //   }),
  // );

  const configService = app.get(ConfigService);
  // console.log({ CORS_ORIGIN: configService.get<string>('JWT_ACCESS_SECRET') });
  app.enableCors({
    // origin: configService.get<string>('CORS_ORIGIN').split(','), // we can pass multiple origins separated by comma(,) in .env file
    origin: true, // allow all requests
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter(configService));
  app.use(
    graphqlUploadExpress({ maxFileSize: 50 * 1024 * 1024, maxFiles: 10 }),
  );

  await app.listen(appEnv.PORT || 4040);
}
bootstrap();
