import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class variant {
  @Field(() => String, { nullable: true })
  text: string;

  @Field(() => String, { nullable: true })
  value: string;
}

@ObjectType()
export class CarDetailsExtension {
  @Field(() => String)
  estimatedPrice: string;

  @Field(() => [variant])
  variant: variant[];

  @Field(() => String)
  actualPrice: string;
}
