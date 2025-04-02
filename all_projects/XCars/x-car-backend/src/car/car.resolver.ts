import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CarService } from './car.service';
import { Car } from './model/car.model';
import { CreateCarInput } from './dto/create-car.dto';
import { UpdateCarStatus } from './dto/update-car.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guard/jwt.guard';
import { Response } from '../common/model/response.model';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../common/model/user.model';
import { RoleGuard } from 'src/guard/role.guard';
import { AllowedRoles } from 'src/decorators/allowed-role.decorator';
import { DocumentType, Roles } from '@prisma/client';
import {
  GetAllCarsAdmin,
  GetAllCarsDealer,
  GetAllCarsUser,
  GetCarDetailAdmin,
  GetCarDetailDealer,
  GetCarDetailUser,
} from './model/get-all-cars.model';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import { CarPaymentGuard } from 'src/guard/car-payment.guard';
import { JwtOptionalGuard } from 'src/guard/jwt-optional.guard';
import { HelperService } from 'src/helper/helper.service';
import { GetCarInput, GetCarsInput } from './dto/get-car.dto';
import {
  UploadCarGalleryDocuments,
  UploadCarProducts,
} from './dto/upload-file-car.dto';
import { AWSService } from 'src/AWS/aws.service';
import { FileType } from 'src/common/types/upload-file-type';
import { CarAnalyticsResponse, CarViewers } from './model/car-analytics.model';
import { CarAnalytics } from './dto/car-analytics.dto';
import { GetCarBundle, GetCarBundles } from './model/get-bundles.model';
import { CarRegistrationNumberInput } from './dto/registration-number.dto';
import { GetCarApproveStatus } from './model/car-approve-status.model';
import { GetModelEstimate } from './dto/get-model-estimate';
import path from 'path';
import natural from 'natural';
import * as fs from 'fs/promises';
import { CarDetailsExtension } from './model/car-estimate-extension.model';

@Resolver(() => Car)
export class CarResolver {
  constructor(
    private readonly carService: CarService,
    private readonly helperService: HelperService,
    private readonly awsService: AWSService,
  ) {}

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER)
  @Mutation(() => Response)
  createCar(
    @GetUser() user: User,
    @Args('createCarInput') createCarInput: CreateCarInput,
  ) {
    return this.carService.create({
      createCarInput: { ...createCarInput, userId: user.id },
      user,
    });
  }

  @Query(() => Response)
  checkCarRegistrationNumber(
    @Args() carRegistrationNumberInput: CarRegistrationNumberInput,
  ) {
    return this.helperService.validateCarRegistrationNumber(
      carRegistrationNumberInput,
    );
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER, Roles.ADMIN)
  @Mutation(() => Response)
  updateCarStatus(
    @Args('cartData') carData: UpdateCarStatus,
    @GetUser('user') user: User,
  ) {
    const role = user.role;
    return this.carService.updateCarStatus(carData, role);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => GetCarApproveStatus)
  checkCarApproveStatus(@Args('carId') carId: string) {
    return this.carService.checkCarApproveStatus({ carId });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => GetAllCarsAdmin)
  async getCarsAdmin(
    @GetUser() user: User,
    @Args() pagination: PaginationInput,
    @Args() carInput: GetCarsInput,
  ): Promise<GetAllCarsAdmin> {
    return this.carService.getCars({
      pagination,
      role: user.role,
      filter: carInput.filter,
      searchString: carInput.searchString,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => GetCarDetailAdmin)
  async getCarDetailAdmin(
    @GetUser() user: User,
    @Args() carInput: GetCarInput,
  ): Promise<GetCarDetailAdmin> {
    const response = await this.carService.getCars({
      carId: carInput.carId,
      role: user.role,
    });

    return { ...response, data: response?.data[0] };
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER)
  @Query(() => GetAllCarsDealer)
  async getCarsDealer(
    @GetUser() user: User,
    @Args() pagination: PaginationInput,
    @Args() carInput: GetCarsInput,
  ): Promise<GetAllCarsDealer> {
    return this.carService.getCars({
      pagination,
      dealerId: user.id,
      role: user.role,
      filter: carInput.filter,
      searchString: carInput.searchString,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER)
  @Query(() => GetCarDetailDealer)
  async getCarDetailDealer(
    @GetUser() user: User,
    @Args() carInput: GetCarInput,
  ): Promise<GetCarDetailDealer> {
    const dealerId = user.id;

    const response = await this.carService.getCars({
      carId: carInput.carId,
      role: user.role,
      dealerId,
    });

    return { ...response, data: response?.data[0] };
  }

  @UseGuards(JwtOptionalGuard)
  @Query(() => GetAllCarsUser)
  async getCarsUser(
    @GetUser() user: User,
    @Args() pagination: PaginationInput,
    @Args() carInput: GetCarsInput,
  ): Promise<GetAllCarsUser> {
    return this.carService.getCars({
      pagination,
      role: user ? user.role : Roles.USER,
      userId: user ? user.id : '',
      filter: carInput.filter,
      searchString: carInput.searchString,
    });
  }

  @UseGuards(JwtOptionalGuard)
  @Query(() => GetCarDetailUser)
  async getCarDetailUser(
    @GetUser() user: User,
    @Args() carInput: GetCarInput,
  ): Promise<GetCarDetailUser> {
    const response = await this.carService.getCars({
      carId: carInput.carId,
      role: user ? user.role : Roles.USER,
      userId: user ? user.id : '',
    });

    let checkLead = null;
    if (user) {
      checkLead = await this.helperService.checkUserForLead({
        carId: carInput.carId,
        userId: user.id,
      });
    }

    return { ...response, data: { ...response?.data[0], lead: checkLead } };
  }

  @UseGuards(JwtGuard, RoleGuard, CarPaymentGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async uploadThumbnail(
    @Args('documentId') documentId: string,
    @Args({ name: 'files', type: () => GraphQLUpload }) file: FileUpload,
    @Args({ name: 'documentType', type: () => DocumentType })
    documentType: DocumentType,
  ) {
    return this.carService.uploadThumbnail({
      documentId,
      file,
      documentType,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async uploadCarProducts(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args() input: UploadCarProducts,
  ): Promise<Response> {
    const { carId, amount, documentType, fileType, id, discountedAmount } =
      input;
    return await this.carService.addCarProduct({
      carId,
      documentType,
      fileType,
      files,
      amount,
      id,
      discountedAmount,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async uploadCarGalleryDocuments(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args() input: UploadCarGalleryDocuments,
  ): Promise<Response> {
    const { carId, documentType, fileType, isThumbnail } = input;
    let keys = null;
    keys = [];

    if (documentType === DocumentType.VIDEO) {
      for await (const file of files) {
        const fileName = await file.filename;
        keys.push({ file, fileName });
      }
    } else {
      for await (const file of files) {
        const fileName = await file.filename;
        const key = await this.awsService.uploadFile({
          file: await file,
          uploadCategory:
            documentType === DocumentType.IMAGE
              ? FileType.IMAGES
              : FileType.DOCUMENTS,
          id: carId,
        });
        keys.push({ path: key, fileName });
      }
    }

    return await this.carService.addCarGalleryDocuments({
      carId,
      documentType,
      fileType,
      keys,
      isThumbnail,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => CarAnalyticsResponse)
  getCarAnalyticsReport(
    @Args() input: CarAnalytics,
  ): Promise<CarAnalyticsResponse> {
    return this.carService.getCarsAnalyticsReport(input);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => CarViewers)
  getCarViewers(
    @Args({ name: 'carId', type: () => String }) carId: string,
    @Args() pagination: PaginationInput,
  ): Promise<CarViewers> {
    return this.carService.getCarViewers(carId, pagination);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Query(() => CarDetailsExtension)
  async getCarsDetailsExtension(@Args() details: GetModelEstimate) {
    async function getFilePath(companyName: string) {
      const basePath = '../../../public/carsDataset/cars/';
      const directoryPath: string = path.join(__dirname, basePath);

      try {
        const files = await fs.readdir(directoryPath, {
          withFileTypes: true,
        });
        const { fileName } = files
          .filter((file) => file.isFile())
          .map((file) => file.name)
          .reduce(
            (prev, fileName) => {
              const jaroWinklerDistance = natural.JaroWinklerDistance(
                fileName,
                companyName,
                { ignoreCase: true },
              );
              if (prev.score < jaroWinklerDistance) {
                return {
                  score: jaroWinklerDistance,
                  fileName,
                };
              }
              return prev;
            },
            { score: 0, fileName: '' },
          );
        return path.resolve(__dirname, basePath + fileName);
      } catch (err) {
        console.error('Error reading directory:', err);
        return '';
      }
    }
    const filePath = await getFilePath(details.company);
    const jsonData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const valueReceived =
      details.variantName + details.transmissionType + details.fuelType;

    const yearWiseCar = jsonData?.years.find(
      (e) => e.year.toLowerCase() == details.year.toLowerCase(),
    );
    const model = yearWiseCar?.models.find(
      (e) => e.model_name.toLowerCase() == details.model.toLowerCase(),
    );

    const variant: { text: string; value: string }[] = [];

    const result: any = {
      max: -1,
    };
    model?.variants
      .filter((e) => e.transmission_type == details.transmissionType)
      .forEach((element) => {
        const actualData =
          element.variant_display_name +
          element.transmission_type +
          element.fuel_type;

        variant.push({
          text: element.variant_display_name,
          value: element.variant_display_name,
        });

        const jaroWinklerDistance = natural.JaroWinklerDistance(
          valueReceived,
          actualData,
          { ignoreCase: true },
        );
        if (result.max < jaroWinklerDistance) {
          result.max = jaroWinklerDistance;
          result['data'] = element;
        }
      });

    function calculateResaleValuePercentage(
      initialPrice,
      depreciationRate,
      yearsUsed,
    ) {
      const resalePrice =
        initialPrice * Math.pow(1 - depreciationRate / 100, yearsUsed);
      return resalePrice.toFixed();
    }

    const estimatedPrice = calculateResaleValuePercentage(
      parseInt(result?.data?.ex_showroom_price),
      15,
      Number(new Date().getFullYear()) - parseInt(details.year),
    );

    return {
      estimatedPrice,
      actualPrice: result?.data?.ex_showroom_price || 'NA',
      variant,
    };
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => GetAllCarsAdmin)
  getCarListViewedByUser(
    @Args({ name: 'userId', type: () => String }) userId: string,
    @Args() pagination: PaginationInput,
  ): Promise<GetAllCarsAdmin> {
    return this.carService.getCarListViewedByUser(userId, pagination);
  }

  @UseGuards(JwtOptionalGuard)
  @Query(() => GetCarBundles)
  async getCarBundles(
    @GetUser() user: User,
    @Args('carId') carId: string,
  ): Promise<GetCarBundles> {
    return await this.carService.getCarBundles({
      carId,
      userId: user?.id ?? '',
      role: user?.role ?? 'USER',
    });
  }

  @UseGuards(JwtOptionalGuard)
  @Query(() => GetCarBundle)
  async getCarBundle(
    @GetUser() user: User,
    @Args('bundleId') bundleId: string,
    @Args('carId') carId: string,
  ): Promise<GetCarBundle> {
    const result = await this.carService.getCarBundles({
      carId,
      userId: user?.id ?? '',
      role: user?.role ?? 'USER',
      bundleId,
    });

    return { ...result, data: result.data[0] };
  }
}
