import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Admin {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  password: string;

  @Field(() => String, { nullable: true })
  email: string;
}
