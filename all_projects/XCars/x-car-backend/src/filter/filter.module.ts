import { Module } from '@nestjs/common';
import { FilterResolver } from './filter.resolver';
import { FilterService } from './filter.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FilterResolver, FilterService],
})
export class FilterModule {}
