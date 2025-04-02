import { ArgsType, Field } from '@nestjs/graphql';
import { appEnv } from 'src/config/app-env';

@ArgsType()
export class PaginationInput {
  @Field(() => Number, { nullable: true, defaultValue: appEnv.Page })
  page?: number;

  @Field(() => Number, { nullable: true, defaultValue: appEnv.LIMIT })
  limit?: number;
}
