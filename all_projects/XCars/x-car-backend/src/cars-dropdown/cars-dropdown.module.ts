import { Module } from '@nestjs/common';
import { CarsDropdownService } from './cars-dropdown.service';
import { CarsDropdownResolver } from './cars-dropdown.resolver';

@Module({
  imports: [],
  providers: [CarsDropdownResolver, CarsDropdownService],
  exports: [CarsDropdownService],
})
export class CarsDropdownModule {}
