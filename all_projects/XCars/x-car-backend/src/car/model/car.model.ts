import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/common/model/user.model';
import {
  CarStatus,
  QuotationStatus,
  FuelType,
  TransmissionType,
  ProductType,
  Currency,
} from '@prisma/client';

@ObjectType()
export class QuotationDetail {
  @Field(() => Number)
  noOfLeads: number;

  @Field(() => Number)
  validityDays: number;

  @Field(() => Number)
  amount: number;

  @Field(() => String)
  currency: string;

  @Field(() => Date, { nullable: true })
  expiryDate?: Date;

  @Field(() => Date, { nullable: true })
  startDate?: Date;
}

@ObjectType()
export class Quotation {
  @Field(() => String)
  id: string;

  @Field(() => QuotationStatus)
  quotationStatus: QuotationStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => QuotationDetail, { nullable: true })
  quotationDetails?: QuotationDetail;
}

@ObjectType()
export class CarDoc {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fileName: string;

  @Field(() => String)
  path: string;

  @Field(() => String)
  documentType: string;
}

@ObjectType()
export class CarProduct {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fileType: string;

  @Field(() => ProductType)
  productType: ProductType;

  @Field(() => Number)
  amount?: number;

  @Field(() => Number, { nullable: true })
  discountedAmount?: number;

  @Field(() => Currency, { nullable: true })
  currency: string;

  @Field(() => String, { nullable: true })
  thumbnail?: string;

  @Field(() => [CarDoc], { nullable: true })
  documents: CarDoc[];

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}

@ObjectType()
export class CarGallery {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fileType: string;

  @Field(() => String, { nullable: true })
  thumbnail?: string;

  @Field(() => [CarDoc])
  documents: CarDoc[];

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}

@ObjectType()
export class BasicCarData {
  @Field()
  id: string;

  @Field(() => Int, { nullable: true })
  launchYear: number;

  @Field(() => Int, { nullable: true })
  totalRun: number;

  @Field(() => Int, { nullable: true })
  noOfOwners: number;

  @Field({ nullable: true })
  model: string;

  @Field(() => String)
  companyName: string;

  @Field({ nullable: true })
  variant: string;

  @Field({ nullable: true })
  registrationNumber: string;

  @Field(() => FuelType, { nullable: true })
  fuelType: FuelType;

  @Field(() => TransmissionType, { nullable: true })
  transmission: TransmissionType;

  @Field(() => CarStatus, { nullable: true })
  carStatus: CarStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class Car extends BasicCarData {
  @Field(() => String)
  userId: string;

  @Field(() => [Quotation], { nullable: true })
  quotation?: Quotation[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [CarProduct], { nullable: true })
  products?: CarProduct[];

  @Field(() => [CarGallery], { nullable: true })
  gallery?: CarGallery[];
}

@ObjectType()
export class DealerCarDetails extends BasicCarData {
  userId: string;

  products?: CarProduct[];

  @Field(() => [Quotation], { nullable: true })
  quotation?: Quotation[];

  @Field(() => [CarGallery], { nullable: true })
  gallery?: CarGallery[];
}

@ObjectType()
export class CarProductInLeadModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fileType: string;

  @Field(() => ProductType)
  productType: ProductType;
}

@ObjectType()
export class UserCarDetails extends BasicCarData {
  @Field(() => String)
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [CarProduct], { nullable: true })
  products?: CarProduct[];

  @Field(() => [CarGallery], { nullable: true })
  gallery?: CarGallery[];

  @Field(() => Boolean, { nullable: true })
  lead?: boolean;
}
