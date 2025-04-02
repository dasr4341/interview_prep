import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { CreateOrderInput } from './dto/create-order.dto';
import {
  RazorpayOrderApp,
  RazorpayOrderWeb,
} from './model/razorpay-order.model';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { AllowedRoles } from 'src/decorators/allowed-role.decorator';
import { Roles } from '@prisma/client';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/common/model/user.model';
import { UseGuards } from '@nestjs/common';
import { CreateEndUserOrderInput } from './dto/create-end-user-order.dto';
import {
  PaymentVerification,
  UserPaymentVerification,
} from './model/payment-verification.model';

@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER)
  @Mutation(() => RazorpayOrderApp)
  async createOrder(
    @GetUser() user: User,
    @Args() createOrderInput: CreateOrderInput,
  ): Promise<RazorpayOrderApp> {
    return await this.paymentService.createOrder({
      ...createOrderInput,
      dealerId: user.id,
    });
  }

  @Mutation(() => PaymentVerification) // Return a Boolean indicating success or failure
  async verifyRazorpayPayment(
    @Args('razorpayOrderId') razorpayOrderId: string,
    @Args('razorpayPaymentId') razorpayPaymentId: string,
    @Args('razorpaySignature') razorpaySignature: string,
  ): Promise<PaymentVerification> {
    const paymentDetails = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    };

    const isValid = await this.paymentService.verifyPayment(paymentDetails);

    if (isValid) {
      await this.paymentService.updatePaymentStatusOnSuccess({
        razorpayOrderId,
        razorpayPaymentId,
      });
    } else {
      await this.paymentService.updatePaymentStatusOnFailure({
        razorpayOrderId,
        razorpayPaymentId,
      });
    }

    const carId = await this.paymentService.getCarId({ razorpayOrderId });

    return {
      carId,
      message: `Payment ${isValid ? 'success' : 'failed'}`,
      success: true,
    }; // Return true if payment is valid, false otherwise
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.USER)
  @Mutation(() => RazorpayOrderWeb)
  async createOrderForEndUser(
    @GetUser() user: User,
    @Args() createOrderInput: CreateEndUserOrderInput,
  ) {
    const response = await this.paymentService.createOrderForEndUser({
      ...createOrderInput,
      userId: user.id,
    });

    console.log('create order end user ->', response);

    return response;
  }

  @Mutation(() => UserPaymentVerification) // Return a Boolean indicating success or failure
  async verifyRazorpayPaymentForEndUser(
    @Args('razorpayOrderId') razorpayOrderId: string,
    @Args('razorpayPaymentId') razorpayPaymentId: string,
    @Args('razorpaySignature') razorpaySignature: string,
  ): Promise<UserPaymentVerification> {
    const paymentDetails = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    };

    const isValid = await this.paymentService.verifyPayment(paymentDetails);

    let paymentId = null;

    if (isValid) {
      paymentId =
        await this.paymentService.updateCarBasedPaymentStatusOnSuccess({
          razorpayOrderId,
          razorpayPaymentId,
        });
    } else {
      paymentId =
        await this.paymentService.updateCarBasedPaymentStatusOnFailure({
          razorpayOrderId,
          razorpayPaymentId,
        });
    }

    return {
      data: {
        paymentId,
      },
      message: `Payment ${isValid ? 'success' : 'failed'}`,
      success: true,
    }; // Return true if payment is valid, false otherwise
  }
}
