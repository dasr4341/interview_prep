import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/common/dto/filter-table.dto';
import { UserTableFilterEnum } from 'src/common/enum/user-filter.enum';

@ArgsType()
export class ViewDealer {
  @Field(() => String)
  dealerId: string;
}

@InputType()
export class UserFilterInput extends FilterInput {
  @Field(() => UserTableFilterEnum)
  column: keyof typeof UserTableFilterEnum;
}
