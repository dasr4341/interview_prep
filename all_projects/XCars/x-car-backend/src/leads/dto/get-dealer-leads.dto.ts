import { ArgsType, Field } from '@nestjs/graphql';
import { DealerLeadFilterInput } from './lead-filter.dto';

@ArgsType()
export class GetDealerLeads {
  @Field(() => String, { nullable: true })
  leadId?: string;

  @Field(() => [DealerLeadFilterInput], { nullable: true })
  filter?: DealerLeadFilterInput[];
}
