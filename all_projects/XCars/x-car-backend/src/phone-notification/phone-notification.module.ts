import { Global, Module } from '@nestjs/common';
import { PhoneNotificationService } from './phone-notification.service';

@Global()
@Module({
  imports: [],
  providers: [PhoneNotificationService],
  exports: [PhoneNotificationService],
})
export class PhoneNotificationModule {}
