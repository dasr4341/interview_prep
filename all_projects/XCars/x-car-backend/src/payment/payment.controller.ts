import {
  Controller,
  Post,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { WebhookService } from './webhook.service';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly webhookService: WebhookService,
    private configService: ConfigService,
  ) {}

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET'); // Razorpay webhook secret

    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    const hash = crypto.createHmac('sha256', secret).update(body).digest('hex');

    // Verify the signature
    if (hash === signature) {
      // Handle the webhook event (payment capture, failure, etc.)
      const event = req.body.event;

      console.log('payment body payload', req.body.payload);

      if (event === 'payment.captured') {
        // Process successful payment
        const paymentData = req.body.payload.payment.entity;
        // Save payment data to the database or update order status
        await this.webhookService.processPaymentSuccess(paymentData);
      }

      res.status(HttpStatus.OK).send({ received: true });
    } else {
      throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
    }
  }
}
