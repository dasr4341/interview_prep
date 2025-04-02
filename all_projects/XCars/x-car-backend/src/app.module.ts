import { LeadsModule } from './leads/leads.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UserModule } from './user/user.module';
import { FaviconMiddleware } from './common/middleware/favicon.middleware';
import { NotFoundMiddleware } from './common/middleware/not-found.middleware';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { DealerModule } from './dealer/dealer.module';
import { AuthModule } from './auth/auth.module';
import { CarModule } from './car/car.module';
import { JwtTokenModule } from './jwt-token/jwt-token.module';
import { AdminModule } from './admin/admin.module';
import { CarsDropdownModule } from './cars-dropdown/cars-dropdown.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerServiceInterceptor } from './logger/logger.service';
import { PaymentModule } from './payment/payment.module';
import { ContactDataModule } from './contact-data/contact-data.module';
import { RegisterPrismaEnums } from './common/enum/prisma.enum';
import { AnalyticsInterceptor } from './common/interceptor/analytics.interceptor';
import { FilterModule } from './filter/filter.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from './guard/throttler.guard';

// To do list
// add rate Limit -> throttle

@Module({
  imports: [
    LeadsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // definitions: { path: join(process.cwd(), 'src/common/types/graphql.ts') },
      playground: false,
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public', 'assets'),
      serveRoot: '/',
      serveStaticOptions: {
        index: false,
        redirect: false,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL'),
          limit: configService.get<number>('THROTTLE_LIMIT'),
        },
      ],
    }),
    AdminModule,
    UserModule,
    DealerModule,
    AuthModule,
    CarModule,
    JwtTokenModule,
    CarsDropdownModule,
    PaymentModule,
    ContactDataModule,
    LeadsModule,
    FilterModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AnalyticsInterceptor,
    { provide: APP_INTERCEPTOR, useClass: LoggerServiceInterceptor },
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
  ],
  exports: [],
})
export class AppModule {
  constructor() {
    RegisterPrismaEnums();
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FaviconMiddleware)
      .forRoutes({ path: '/favicon.ico', method: RequestMethod.ALL });
    consumer
      .apply(NotFoundMiddleware)
      .forRoutes({ path: '/assets/*', method: RequestMethod.ALL });
  }
}
