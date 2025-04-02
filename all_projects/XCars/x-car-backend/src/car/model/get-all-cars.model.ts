import { ObjectType, Field, createUnionType } from '@nestjs/graphql';
import { Response } from 'src/common/model/response.model';
import { Car, DealerCarDetails, UserCarDetails } from './car.model';
import { Pagination } from 'src/common/model/pagination.model';

@ObjectType()
export class GetAllCarsAdmin extends Response {
  @Field(() => [Car])
  data: Car[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}

@ObjectType()
export class GetCarDetailAdmin extends Response {
  @Field(() => Car)
  data: Car;
}

@ObjectType()
export class GetAllCarsDealer extends Response {
  @Field(() => [DealerCarDetails])
  data: DealerCarDetails[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}

@ObjectType()
export class GetCarDetailDealer extends Response {
  @Field(() => DealerCarDetails)
  data: DealerCarDetails;
}

@ObjectType()
export class GetAllCarsUser extends Response {
  @Field(() => [UserCarDetails])
  data: UserCarDetails[];

  @Field(() => Pagination, { nullable: true })
  pagination?: Pagination;
}

@ObjectType()
export class GetCarDetailUser extends Response {
  @Field(() => UserCarDetails)
  data: UserCarDetails;
}

export const GetCarList = createUnionType({
  name: 'GetCarList',
  types: () => [GetAllCarsAdmin, GetAllCarsDealer, GetAllCarsUser],
  resolveType(value) {
    if (value instanceof GetAllCarsAdmin) {
      return GetAllCarsAdmin;
    }
    if (value instanceof GetAllCarsDealer) {
      return GetAllCarsDealer;
    }
    if (value instanceof GetAllCarsUser) {
      return GetAllCarsUser;
    }
    return null;
  },
});
