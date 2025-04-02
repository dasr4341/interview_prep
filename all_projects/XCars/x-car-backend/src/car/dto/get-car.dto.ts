import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { FilterInput } from 'src/common/dto/filter-table.dto';
import { CarTableFilter } from 'src/common/enum/car-filter.enum';
import { getModelColumnNames } from 'src/common/helper';

const carColumnNames = getModelColumnNames({ model: 'car' });

@ArgsType()
export class GetCarInput {
  @IsUUID(undefined, { message: 'Car Id is invalid!' })
  @Field(() => String)
  carId: string;
}

@InputType()
export class CarsFilterInput extends FilterInput {
  @Field(() => CarTableFilter)
  column: keyof typeof CarTableFilter;
}

@ArgsType()
export class GetCarsInput {
  @Field(() => String, { nullable: true })
  searchString?: string;

  @Field(() => [CarsFilterInput], { nullable: true })
  filter?: CarsFilterInput[];

  @Field(() => String, {
    nullable: true,
    description: `Suggested columns: ${carColumnNames.join(', ')}`,
  })
  suggestedColumn?: string;
}

@ArgsType()
export class GetUserCarsInput {
  @Field(() => String, { nullable: true })
  carId?: string;

  @Field(() => String, { nullable: true })
  dealerId?: string;

  @Field(() => String, { nullable: true })
  searchString?: string;

  @Field(() => [CarsFilterInput], { nullable: true })
  filter?: CarsFilterInput[];
}
