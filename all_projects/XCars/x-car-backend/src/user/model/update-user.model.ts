import { Field, ObjectType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class EndUser {
  @Field(() => String)
  id: string;

  role: Roles;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  location: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  phoneNumber: string;
}

@ObjectType()
export class UpdateEndUser extends Response {
  @Field(() => EndUser)
  data: EndUser;
}
