import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';
import { QuotationStatus } from '@prisma/client';
import { Pagination } from 'src/common/model/pagination.model';
import { Car, QuotationDetail } from 'src/car/model/car.model';

@ObjectType()
class AdminDetail {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;
}

@ObjectType()
export class DealerQuotation {
  @Field(() => String)
  id: string;

  @Field(() => AdminDetail, { nullable: true })
  adminDetail: AdminDetail;

  @Field(() => QuotationStatus)
  quotationStatus: QuotationStatus;

  @Field(() => String)
  carId: string;

  @Field(() => QuotationDetail)
  quotationDetails: QuotationDetail;

  @Field(() => Car, { nullable: true })
  car?: Car;
}

@ObjectType()
export class GetDealerQuotation extends Response {
  @Field(() => DealerQuotation, { nullable: true })
  dealerQuotationDetails: DealerQuotation;
}

@ObjectType()
export class GetDealerQuotations {
  @Field(() => String)
  key: string;

  @Field(() => [DealerQuotation])
  quotations: DealerQuotation[];
}

@ObjectType()
export class ModifiedGetDealerQuotations extends Response {
  @Field(() => [GetDealerQuotations])
  data: GetDealerQuotations[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}
