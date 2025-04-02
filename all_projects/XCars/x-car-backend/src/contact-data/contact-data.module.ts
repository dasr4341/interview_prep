import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactDataResolver } from './contact-data.resolver';
import { ContactDataService } from './contact-data.service';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { AuthModule } from 'src/auth/auth.module';
import { CheckerModule } from 'src/checker/checker.module';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [PrismaModule, AuthModule, CheckerModule, HelperModule],
  providers: [
    ContactDataResolver,
    ContactDataService,
    EmailNotificationService,
  ],
})
export class ContactDataModule {}
