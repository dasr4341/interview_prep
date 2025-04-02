import { Field, ObjectType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { CarProduct } from 'src/car/model/car.model';

@ObjectType()
class QuotationCarDetails {
  @Field(() => String)
  registrationNumber: string;
}

@ObjectType()
class PaymentQuotationDetails {
  @Field(() => QuotationCarDetails)
  car: QuotationCarDetails;
}

@ObjectType()
export class InvoiceRecord {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  quotationId?: string;

  @Field(() => PaymentQuotationDetails, { nullable: true })
  quotation?: PaymentQuotationDetails;

  @Field(() => String)
  razorpayOrderId: string;

  @Field(() => [CarProduct], { nullable: true })
  productsPurchased?: CarProduct[];

  @Field(() => CarProduct, { nullable: true })
  bundleDetails?: CarProduct;

  @Field(() => String, { nullable: true })
  carId?: string;

  @Field(() => String, { nullable: true })
  carDetail: string;

  @Field(() => String)
  userName: string;

  @Field(() => Roles)
  userRole: Roles;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  razorpayPaymentId: string;

  @Field(() => Number)
  amount: number;

  @Field(() => String)
  invoiceStatus: string;

  @Field(() => Number)
  amountPaid: number;

  @Field(() => Number)
  amountDue: number;

  @Field(() => String, { nullable: true })
  receipt?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
