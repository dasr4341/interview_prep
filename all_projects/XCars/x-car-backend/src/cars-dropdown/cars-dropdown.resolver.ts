import { Resolver, Query, Args } from '@nestjs/graphql';
import { CarsDropdownService } from './cars-dropdown.service';
import { DropdownVariant } from './model/car-variant.model';
import { DropdownCompanies } from 'src/cars-dropdown/model/dropdown-companies.model';
import { DropdownYear } from 'src/cars-dropdown/model/dropdown-year.model';
import { DropdownModels } from 'src/cars-dropdown/model/dropdown-models.model';
import { CarsVariant } from './dto/cars-variants.dto';
import { FuelWithTransmission } from './model/fuel-with-transmission.model';

@Resolver()
export class CarsDropdownResolver {
  constructor(private readonly carsDropdownService: CarsDropdownService) {}

  @Query(() => DropdownCompanies)
  async getCompanyList(): Promise<DropdownCompanies> {
    return this.carsDropdownService.getCompanyList();
  }

  @Query(() => DropdownYear)
  async getManufacturingYear(
    @Args('companyName') companyName: string,
  ): Promise<DropdownYear> {
    return this.carsDropdownService.getManufacturingYear(companyName);
  }

  @Query(() => DropdownModels)
  async getModelNamesForYear(
    @Args('companyName') companyName: string,
    @Args('year') year: string,
  ): Promise<DropdownModels> {
    return this.carsDropdownService.getModelNamesForYear(companyName, year);
  }

  @Query(() => FuelWithTransmission)
  async getFuelWithTransmissionType(
    @Args('companyName') companyName: string,
    @Args('year') year: string,
    @Args('model') model: string,
  ): Promise<FuelWithTransmission> {
    return this.carsDropdownService.getFuelWithTransmissionType(
      companyName,
      year,
      model,
    );
  }

  @Query(() => DropdownVariant)
  async getVariantForModel(
    @Args() variantQuery: CarsVariant,
  ): Promise<DropdownVariant> {
    return this.carsDropdownService.getVariantForModel(variantQuery);
  }
}
