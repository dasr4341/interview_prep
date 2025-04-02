import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';

enum DealerChangeableStatus {
  APPROVED = 'APPROVED',
  DISABLED = 'DISABLED',
}
registerEnumType(DealerChangeableStatus, { name: 'Application' });

@ArgsType()
export class UpdateDealerStatusInput {
  @Field(() => String)
  id: string;

  @Field(() => DealerChangeableStatus)
  updatedStatus: DealerChangeableStatus;
}
