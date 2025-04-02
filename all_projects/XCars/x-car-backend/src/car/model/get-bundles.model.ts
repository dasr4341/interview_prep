import { Field, ObjectType } from '@nestjs/graphql';
import { DocumentType, ProductType } from '@prisma/client';
import { Response } from 'src/common/model/response.model';

@ObjectType()
class CarProductDocuments {
  @Field(() => DocumentType)
  documentType: DocumentType;

  @Field(() => String)
  fileName: string;

  @Field(() => String)
  path: string;
}
@ObjectType()
class BundleCarProduct {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fileType: string;

  @Field(() => Number)
  amount: number;

  @Field(() => Number)
  discountedAmount: number;

  @Field(() => ProductType)
  productType: ProductType;

  @Field(() => String, { nullable: true })
  thumbnail?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => [CarProductDocuments], { nullable: true })
  carProductDocuments: CarProductDocuments[];
}

@ObjectType()
class BundledItems {
  @Field(() => BundleCarProduct)
  carProduct: BundleCarProduct;
}

@ObjectType()
export class CarBundle {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fileType: string;

  @Field(() => String, { nullable: true })
  thumbnail: string;

  @Field(() => Number)
  amount: number;

  @Field(() => Number)
  discountedAmount: number;

  @Field(() => [BundledItems])
  bundledItems: BundledItems[];
}

@ObjectType()
export class GetCarBundles extends Response {
  @Field(() => [CarBundle], { nullable: true })
  data?: CarBundle[];
}

@ObjectType()
export class GetCarBundle extends Response {
  @Field(() => CarBundle, { nullable: true })
  data?: CarBundle;
}
