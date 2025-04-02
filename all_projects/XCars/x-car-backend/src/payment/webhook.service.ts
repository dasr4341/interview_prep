import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebhookService {
  constructor(private prismaService: PrismaService) {}

  async processPaymentSuccess(paymentData: any) {
    const { id, status } = paymentData;

    // Add your logic to handle successful payments, such as:
    // - Mark the order as paid
    // - Save the payment details to the database
    console.log(
      `Payment with ID ${id} has been captured with status ${status}.`,
    );
  }
}
