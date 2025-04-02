import { Global, Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';

@Global()
@Module({
  imports: [],
  providers: [EmailNotificationService],
  exports: [EmailNotificationService],
})
export class EmailNotificationModule {}
