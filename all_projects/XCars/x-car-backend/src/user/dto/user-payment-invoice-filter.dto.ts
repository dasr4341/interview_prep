import { Field, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/common/dto/filter-table.dto';
import { UserInvoiceTableFilterEnum } from 'src/common/enum/user-payment-invoice-filter';

@InputType()
export class UserInvoiceFilterInput extends FilterInput {
  @Field(() => UserInvoiceTableFilterEnum)
  column: keyof typeof UserInvoiceTableFilterEnum;
}
