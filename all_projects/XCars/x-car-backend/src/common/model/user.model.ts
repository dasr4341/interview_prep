import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserDocument } from './user-document.model';
import { Response } from '../../common/model/response.model';
import { UserStatus, Roles } from '@prisma/client';
import { Pagination } from './pagination.model';

registerEnumType(UserStatus, { name: 'Status' });
registerEnumType(Roles, { name: 'Roles' });
@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  role: Roles;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  profileImage: string;

  @Field(() => String, { nullable: true })
  companyName: string;

  @Field(() => String, { nullable: true })
  location: string;

  @Field(() => UserStatus, { nullable: true })
  userStatus: UserStatus;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  phoneNumber: string;

  @Field(() => [UserDocument], { nullable: true })
  documents?: UserDocument[];
}

@ObjectType()
export class UserDetails extends Response {
  @Field(() => User, { nullable: true })
  data: User;
}

@ObjectType()
export class AllUsers extends Response {
  @Field(() => [User])
  data: User[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}
