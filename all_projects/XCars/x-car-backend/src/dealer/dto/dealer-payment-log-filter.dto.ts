import { Field, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/common/dto/filter-table.dto';
import { DealerInvoiceTableFilterEnum } from 'src/common/enum/dealer-payment-invoice-filter';

@InputType()
export class DealerInvoiceFilterInput extends FilterInput {
  @Field(() => DealerInvoiceTableFilterEnum)
  column: keyof typeof DealerInvoiceTableFilterEnum;
}
