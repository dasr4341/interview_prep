import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { CheckerModule } from 'src/checker/checker.module';
import { EmailNotificationModule } from 'src/email-notification/email-notification.module';

@Module({
  imports: [
    PrismaModule,
    JwtTokenModule,
    CheckerModule,
    EmailNotificationModule,
  ],
  providers: [AdminResolver, AdminService],
  exports: [],
})
export class AdminModule {}
