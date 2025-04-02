import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDocument {
  @Field(() => String)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  fileName: string;

  @Field(() => String)
  path: string;
}
