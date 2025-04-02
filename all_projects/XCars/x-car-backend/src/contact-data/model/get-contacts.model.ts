import { Field, ObjectType } from '@nestjs/graphql';
import { BasicCarData } from 'src/car/model/car.model';
import { ContactMessage } from 'src/common/model/contact.model';
import { Pagination } from 'src/common/model/pagination.model';
import { Response } from 'src/common/model/response.model';

@ObjectType()
export class ContactsDataInQuoteModel {
  @Field(() => String)
  id: string;

  @Field(() => [ContactMessage], { nullable: true })
  contactMessage?: ContactMessage[];

  @Field(() => String, { nullable: true })
  alternatePhone?: string;

  @Field(() => String, { nullable: true })
  alternateEmail?: string;

  @Field(() => BasicCarData)
  car: BasicCarData;
}

@ObjectType()
export class GetContactsData extends Response {
  @Field(() => [ContactsDataInQuoteModel])
  data: [ContactsDataInQuoteModel];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}
