import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { FilterInput } from 'src/common/dto/filter-table.dto';
import { CarTableFilterEnum } from 'src/common/enum/car-filter.enum';
import { DealerLeadTableFilterEnum } from 'src/common/enum/dealer-lead-filter.enum';
import { LeadTableFilterEnum } from 'src/common/enum/lead-filter.enum';
import { UserTableFilterEnum } from 'src/common/enum/user-filter.enum';

const DealerLeadFilter = {
  ...LeadTableFilterEnum,
  ...DealerLeadTableFilterEnum,
  ...CarTableFilterEnum,
} as const;

const AdminLeadFilter = {
  ...LeadTableFilterEnum,
  ...UserTableFilterEnum,
  ...CarTableFilterEnum,
} as const;

registerEnumType(DealerLeadFilter, { name: 'DealerLeadFilter' });
registerEnumType(AdminLeadFilter, { name: 'AdminLeadFilter' });

@InputType()
export class DealerLeadFilterInput extends FilterInput {
  @Field(() => DealerLeadFilter)
  column: keyof typeof DealerLeadFilter;
}

@InputType()
export class LeadFilterInput extends FilterInput {
  @Field(() => AdminLeadFilter)
  column: keyof typeof AdminLeadFilter;
}
