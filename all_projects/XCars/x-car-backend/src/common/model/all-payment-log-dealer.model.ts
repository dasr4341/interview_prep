import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from './response.model';
import { InvoiceRecord } from 'src/common/model/payment-invoice.model';
import { Pagination } from './pagination.model';

@ObjectType()
export class UserPaymentLogs extends Response {
  @Field(() => [InvoiceRecord], { nullable: true })
  data?: InvoiceRecord[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}

@ObjectType()
export class UserPaymentLog extends Response {
  @Field(() => InvoiceRecord, { nullable: true })
  data?: InvoiceRecord;
}
