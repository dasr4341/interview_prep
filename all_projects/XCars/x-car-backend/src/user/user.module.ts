import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { EmailNotificationModule } from 'src/email-notification/email-notification.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HelperModule } from 'src/helper/helper.module';
import { PhoneNotificationModule } from 'src/phone-notification/phone-notification.module';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { AWSModule } from 'src/AWS/aws.module';
import { CheckerModule } from 'src/checker/checker.module';
import { CarModule } from 'src/car/car.module';
import { FilterService } from 'src/filter/filter.service';

@Module({
  imports: [
    CheckerModule,
    EmailNotificationModule,
    PrismaModule,
    HelperModule,
    PhoneNotificationModule,
    JwtTokenModule,
    AWSModule,
    CarModule,
  ],
  providers: [UserResolver, UserService, FilterService],
  exports: [UserService],
})
export class UserModule {}
