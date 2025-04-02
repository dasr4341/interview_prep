import { Field, ObjectType } from '@nestjs/graphql';
import {
  BasicCarData,
  CarDoc,
  CarProduct,
  Quotation,
} from 'src/car/model/car.model';
import { User } from 'src/common/model/user.model';
import { LeadsStatus, LeadType } from '@prisma/client';
import { ContactsData } from 'src/common/model/contact.model';

@ObjectType()
export class CarGalleryDoc {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fileType: string;

  @Field(() => String, { nullable: true })
  thumbnail?: string;

  @Field(() => [CarDoc], { nullable: true })
  CarGalleryDocuments?: CarDoc[];

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}

@ObjectType()
export class CarInLead extends BasicCarData {
  @Field(() => String)
  userId: string;

  @Field(() => [Quotation], { nullable: true })
  quotation?: Quotation[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [CarProduct], { nullable: true })
  products?: CarProduct[];

  @Field(() => [CarGalleryDoc], { nullable: true })
  carGallery?: CarGalleryDoc[];
}

@ObjectType()
export class Lead {
  @Field(() => String)
  id: string;

  @Field(() => String)
  carId: string;

  @Field(() => String)
  userId: string;

  @Field(() => ContactsData, { nullable: true })
  contact?: ContactsData;

  @Field(() => LeadType)
  leadType: LeadType;

  @Field(() => LeadsStatus)
  leadStatus: LeadsStatus;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => CarInLead, { nullable: true })
  car?: CarInLead;

  @Field(() => Number, { nullable: true })
  callCount?: number;

  @Field(() => Boolean, { defaultValue: false })
  activeQuotation: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  assigned?: boolean;
}
