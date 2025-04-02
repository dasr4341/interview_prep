import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { DropdownVariant } from './model/car-variant.model';
import { DropdownCompanies } from 'src/cars-dropdown/model/dropdown-companies.model';
import { DropdownYear } from 'src/cars-dropdown/model/dropdown-year.model';
import { DropdownModels } from 'src/cars-dropdown/model/dropdown-models.model';
import { CarsVariant } from './dto/cars-variants.dto';
import { FuelWithTransmission } from './model/fuel-with-transmission.model';
import { TransmissionType, FuelType } from '@prisma/client';
import CustomError from 'src/global-filters/custom-error-filter';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import ErrorMessage from 'src/global-filters/error-message-filter';

@Injectable()
export class CarsDropdownService {
  private datasetFolderPath: string;
  private allDataFiles: { [key: string]: string } = {};

  constructor() {
    this.datasetFolderPath = path.join(
      process.cwd(),
      'public',
      'carsDataset',
      'cars',
    );
    this.mapCompanyAndFileName();
  }

  private async mapCompanyAndFileName() {
    const files = await fs.readdir(this.datasetFolderPath);

    for (const file of files) {
      const filePath = path.join(this.datasetFolderPath, file);
      const readFileData = await fs.readFile(filePath, 'utf8');
      const fileJsonData = JSON.parse(readFileData);
      this.allDataFiles[fileJsonData.make_display] = file;
    }
  }

  async getCompanyList(): Promise<DropdownCompanies> {
    try {
      const allCompanies = Object.keys(this.allDataFiles);
      return {
        companies: allCompanies,
        message: 'List of all companies',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
  async getManufacturingYear(company: string): Promise<DropdownYear> {
    try {
      const manufacturingYears: string[] = [];
      const readFileData = await fs.readFile(
        path.join(this.datasetFolderPath, this.allDataFiles[company]),
        'utf8',
      );
      const fileJsonData = JSON.parse(readFileData);
      for (const data of fileJsonData.years) {
        manufacturingYears.push(data.year);
      }

      if (!manufacturingYears.length) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Manufacturing year'),
        );
      }

      return {
        manufacturingYears,
        message: 'Manufacturing years for company',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getModelNamesForYear(
    company: string,
    year: string,
  ): Promise<DropdownModels> {
    try {
      const modelNames: string[] = [];
      const readFileData = await fs.readFile(
        path.join(this.datasetFolderPath, this.allDataFiles[company]),
        'utf8',
      );
      const fileJsonData = JSON.parse(readFileData);
      const dataForYear = fileJsonData.years.find((item) => item.year === year);
      for (const data of dataForYear.models) {
        modelNames.push(data.model_display);
      }

      if (!modelNames.length) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Models'),
        );
      }

      return {
        modelNames,
        message: 'List of all car models for selected year ',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getFuelWithTransmissionType(
    company: string,
    year: string,
    model: string,
  ): Promise<FuelWithTransmission> {
    try {
      const readFileData = await fs.readFile(
        path.join(this.datasetFolderPath, this.allDataFiles[company]),
        'utf8',
      );
      const fileJsonData = JSON.parse(readFileData);
      const dataForYear = fileJsonData.years.find((item) => item.year === year);
      const variantsForModel = dataForYear.models.find(
        (item) => item['model_display'] === model,
      );

      if (!variantsForModel.variants.length) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Fuel type'),
        );
      }

      const fuelTransmissionGroup: { [key: string]: string[] } =
        variantsForModel.variants.reduce(
          (acc, { fuel_type, transmission_type }) => {
            if (!acc[fuel_type]) {
              acc[fuel_type] = [];
            }
            if (!acc[fuel_type].includes(transmission_type)) {
              acc[fuel_type].push(transmission_type);
            }
            return acc;
          },
          {},
        );

      return {
        fuelTransmissionGroup,
        message: 'List of all fuel type with its transmission',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getVariantForModel(
    variantQuery: CarsVariant,
  ): Promise<DropdownVariant> {
    try {
      const readFileData = await fs.readFile(
        path.join(
          this.datasetFolderPath,
          this.allDataFiles[variantQuery.company],
        ),
        'utf8',
      );
      const fileJsonData = JSON.parse(readFileData);
      const dataForYear = fileJsonData.years.find(
        (item) => item.year === variantQuery.year,
      );
      const variantsForModel = dataForYear.models.find(
        (item) => item['model_display'] === variantQuery.model,
      );

      const filteredVariants: {
        variantName: string;
        transmissionType: TransmissionType;
        fuelType: FuelType;
      }[] = [];

      for (const variant of variantsForModel.variants) {
        if (
          variant.transmission_type === variantQuery.transmissionType &&
          variant.fuel_type === variantQuery.fuelType
        ) {
          filteredVariants.push({
            variantName: variant.variant_display_name,
            transmissionType: variant.transmission_type,
            fuelType: variant.fuel_type,
          });
        }
      }

      if (!filteredVariants.length) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Variants'),
        );
      }

      return {
        variant: filteredVariants,
        message: 'List of all variant for selected model.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
}
