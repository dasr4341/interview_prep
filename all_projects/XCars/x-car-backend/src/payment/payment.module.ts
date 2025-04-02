import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WebhookService } from './webhook.service';
import { CheckerModule } from 'src/checker/checker.module';

@Module({
  imports: [CheckerModule],
  providers: [
    PaymentResolver,
    PaymentController,
    PaymentService,
    WebhookService,
  ],
  exports: [],
})
export class PaymentModule {}
