import { Field, ObjectType } from '@nestjs/graphql';
import { Response } from '../../common/model/response.model';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class FuelWithTransmission extends Response {
  @Field(() => GraphQLJSONObject, { nullable: true })
  fuelTransmissionGroup?: { [key: string]: string[] };
}
