import { Field, ObjectType } from '@nestjs/graphql';
import { Car, CarProductInLeadModel } from 'src/car/model/car.model';
import { Pagination } from 'src/common/model/pagination.model';
import { Response } from 'src/common/model/response.model';
import { User } from 'src/common/model/user.model';
import { LeadsStatus, LeadType } from '@prisma/client';
import { ContactsData } from 'src/common/model/contact.model';

@ObjectType()
export class PurchasedProduct {
  @Field(() => CarProductInLeadModel)
  carProduct: CarProductInLeadModel;
}

@ObjectType()
class LeadDetail {
  @Field(() => String)
  id: string;

  @Field(() => ContactsData, { nullable: true })
  contact?: ContactsData;

  @Field(() => LeadType)
  leadType: LeadType;

  @Field(() => LeadsStatus)
  leadStatus: LeadsStatus;

  @Field(() => Car)
  car: Car;

  @Field(() => [PurchasedProduct])
  purchasedProducts: PurchasedProduct[];

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
class DealerLeads {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => Boolean)
  seen: boolean;

  @Field(() => String)
  dealerId: string;

  @Field(() => LeadDetail)
  lead: LeadDetail;
}

@ObjectType()
export class DealerLeadsResponse extends Response {
  @Field(() => [DealerLeads], { nullable: true })
  leads: DealerLeads[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}
