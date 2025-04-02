import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { LeadFilterInput } from './lead-filter.dto';

@InputType()
@ArgsType()
export class GetAdminLeads {
  @Field(() => String, { nullable: true })
  leadId?: string;

  @Field(() => [LeadFilterInput], {
    nullable: true,
  })
  filter?: LeadFilterInput[];
}
