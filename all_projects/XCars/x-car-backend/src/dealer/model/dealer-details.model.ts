import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from '../../common/model/response.model';
import { Currency, UserStatus } from '@prisma/client';

@ObjectType()
export class Doc {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fileName: string;

  @Field(() => String, { nullable: true })
  path?: string;

  @Field(() => Number, { nullable: true })
  amount?: number;

  @Field(() => Currency, { nullable: true })
  currency?: string;

  @Field(() => String, { nullable: true })
  thumbnail?: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}

@ObjectType()
export class DealerDocuments {
  @Field(() => String, { nullable: true })
  fileType?: string;

  @Field(() => [Doc], { nullable: true })
  docs?: Doc[];
}

@ObjectType()
export class DealerDetails {
  @Field(() => String)
  id: string;

  role: string;

  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

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

  @Field(() => Number, { nullable: true })
  totalCars?: number;

  @Field(() => Number, { nullable: true })
  totalActiveQuotation?: number;

  @Field(() => Number, { nullable: true })
  totalPendingQuotation?: number;

  @Field(() => [DealerDocuments], { nullable: true })
  documents?: DealerDocuments[];
}

@ObjectType()
export class GetDealerDetails extends Response {
  @Field(() => DealerDetails, { nullable: true })
  data?: DealerDetails;
}
