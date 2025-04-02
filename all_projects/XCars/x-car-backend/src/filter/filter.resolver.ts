import { Args, Query, Resolver } from '@nestjs/graphql';
import { FilterService } from './filter.service';
import { getFilterOperators } from 'src/config/filter-operators';
import { TableColumnType } from 'src/common/enum/column-type.enum';
import { FilterOperators } from './model/filter-operators.model';

@Resolver()
export class FilterResolver {
  constructor(private filterService: FilterService) {}

  @Query(() => FilterOperators)
  async getFilteredOperator(
    @Args('columnType', { type: () => TableColumnType })
    columnType: TableColumnType,
  ) {
    const operators = getFilterOperators(columnType);
    console.log(operators);
    return {
      data: operators,
      message: 'All related operators for selected column.',
      success: true,
    };
  }
}
