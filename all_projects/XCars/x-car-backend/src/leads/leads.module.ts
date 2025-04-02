import { FilterService } from 'src/filter/filter.service';
import { LeadsResolver } from './leads.resolver';
import { LeadsService } from './leads.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [LeadsResolver, LeadsService, FilterService],
})
export class LeadsModule {}
