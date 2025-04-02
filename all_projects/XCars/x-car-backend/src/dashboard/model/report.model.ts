import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class ReportData {
  @Field(() => String)
  key: string;

  @Field(() => Number)
  count: number;
}
@ObjectType()
export class ReportDataModel extends Response {
  @Field(() => [ReportData])
  data: ReportData[];
}
