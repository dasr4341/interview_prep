import { Field, InputType } from '@nestjs/graphql';
import { TableColumnType } from 'src/common/enum/column-type.enum';

@InputType()
export class FilterInput {
  @Field(() => [String], { nullable: true })
  value?: string | string[];

  @Field(() => String)
  operator: string;

  @Field(() => TableColumnType)
  type: TableColumnType;
}
