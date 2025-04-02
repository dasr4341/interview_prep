import { Injectable } from '@nestjs/common';
import { CreateCarInput } from './dto/create-car.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StatusCodes } from '../common/enum/status-codes.enum';
import { User } from 'src/common/model/user.model';
import {
  Roles,
  UserStatus,
  CarStatus,
  QuotationStatus,
  DocumentType,
  ProductType,
  RazorpayOrderStatus,
} from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FileUpload } from 'graphql-upload';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import ErrorMessage from 'src/global-filters/error-message-filter';
import CustomError from 'src/global-filters/custom-error-filter';
import {
  GetAllCarsAdmin,
  GetAllCarsDealer,
  GetAllCarsUser,
} from './model/get-all-cars.model';
import { Response } from 'src/common/model/response.model';
import { AWSService } from 'src/AWS/aws.service';
import { UpdateCarStatus } from './dto/update-car.dto';
import { CheckerService } from 'src/checker/checker.service';
import { HelperService } from 'src/helper/helper.service';
import { FileType } from 'src/common/types/upload-file-type';
import { CarAnalyticsResponse, CarViewers } from './model/car-analytics.model';
import { FilterService } from 'src/filter/filter.service';
import { CarAnalytics } from './dto/car-analytics.dto';
import { CarsFilterInput } from './dto/get-car.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { getColumnNames, getISTDateTimeString } from 'src/common/helper';
import { CarTableFilter } from 'src/common/enum/car-filter.enum';
import { filterOperators } from 'src/config/filter-operators';

@Injectable()
export class CarService {
  // private vimeoAccessToken: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly awsService: AWSService,
    private readonly checkerService: CheckerService,
    private readonly helperService: HelperService,
    private readonly filterService: FilterService,
    private emailNotificationService: EmailNotificationService,
  ) {
    // this.vimeoAccessToken = this.configService.get('VIMEO_ACCESS_TOKEN');
  }

  async create({
    createCarInput,
    user,
  }: {
    createCarInput: CreateCarInput;
    user: User;
  }) {
    try {
      if (user.userStatus !== UserStatus.ONBOARDED) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.pending('approval'),
        );
      }

      const cartExists = await this.prismaService.car.findUnique({
        where: { registrationNumber: createCarInput.registrationNumber },
      });
      if (cartExists) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.alreadyExists('Car'),
        );
      }

      const car = await this.prismaService.car.create({
        data: {
          ...createCarInput,
          registrationNumber: createCarInput.registrationNumber.toUpperCase(),
        },
      });

      // notifying admin
      const emailTemplatePath = path.join(
        path.resolve(),
        'public',
        'templates',
        'newCarPosted.html',
      );
      const htmlTemplate = await fs.readFile(emailTemplatePath, 'utf8');
      await this.emailNotificationService.sendMail({
        recipientEmail: this.configService.get<string>('ADMIN_EMAIL'),
        emailTemplate: htmlTemplate,
        subject: `A new car is posted by ${user.firstName} ${user.lastName ?? ''}`,
        name: `${user.firstName} ${user.lastName ?? ''}`,
        url: `${this.configService.get<string>('FRONTEND_URL')}/dashboard/cars/${car.id}/dashboard`,
        date: getISTDateTimeString(new Date()),
      });

      return {
        message: 'Car added successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async checkCarApproveStatus({ carId }: { carId: string }) {
    try {
      const cartExists = await this.prismaService.car.findUnique({
        where: { id: carId },
      });
      if (!cartExists) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Car'),
        );
      }
      const carApproveStatus = {
        isCarProductExist: false,
        isCarImageExist: false,
        isCarVideoExist: false,
        isQuotationExist: false,
        isQuotationPaid: false,
        isThumbnailExist: false,
      };
      const quotation = await this.prismaService.quotation.findFirst({
        where: {
          carId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          quotationDetails: true,
        },
      });

      if (quotation) {
        if (
          quotation.quotationStatus !== QuotationStatus.EXPIRED &&
          quotation.quotationStatus !== QuotationStatus.CANCELLED
        ) {
          carApproveStatus.isQuotationExist = true;
        }
        if (
          quotation?.quotationStatus === QuotationStatus.PAID ||
          quotation?.quotationStatus === QuotationStatus.ACTIVE
        ) {
          carApproveStatus.isQuotationPaid = true;
        }
      }

      const carProducts = await this.prismaService.carProductDocuments.findMany(
        {
          where: {
            carProduct: { carId, deleted: false },
          },
        },
      );

      if (carProducts.length) {
        carApproveStatus.isCarProductExist = true;
      }
      const carImages = await this.prismaService.carGallery.findMany({
        where: {
          carGalleryDocuments: {
            some: {
              documentType: DocumentType.IMAGE,
            },
          },
          carId,
        },
      });
      if (carImages.length) {
        carApproveStatus.isCarImageExist = true;
      }

      const carThumbnail = await this.prismaService.carGallery.findFirst({
        where: {
          carId,
          thumbnail: true,
        },
      });
      if (carThumbnail) {
        carApproveStatus.isThumbnailExist = true;
      }

      const carVideos = await this.prismaService.carGallery.findMany({
        where: {
          carGalleryDocuments: {
            some: {
              documentType: DocumentType.VIDEO,
            },
          },
          carId,
        },
      });
      if (carVideos.length) {
        carApproveStatus.isCarVideoExist = true;
      }
      const carStatus = Object.values(carApproveStatus).every((value) => value);

      return {
        data: { requiredData: carApproveStatus, approveStatus: carStatus },
        message: 'Car approve status',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateCarStatus(carData: UpdateCarStatus, role: Roles) {
    try {
      if (role === Roles.ADMIN) {
        await this.checkerService.checkCarDocuments({ carId: carData.id });
      }
      const quotation = await this.prismaService.quotation.findFirst({
        where: {
          carId: carData.id,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          quotationDetails: true,
        },
      });

      if (
        role === Roles.ADMIN &&
        carData.carStatus === CarStatus.APPROVED &&
        !([QuotationStatus.PAID, QuotationStatus.ACTIVE] as string[]).includes(
          quotation.quotationStatus,
        )
      ) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom('Car quotation is not paid yet!'),
        );
      }

      await this.prismaService.$transaction(async (tx) => {
        await tx.car.update({
          where: { id: carData.id },
          data: { carStatus: carData.carStatus },
        });
        if (
          carData.carStatus === CarStatus.SOLD ||
          carData.carStatus === CarStatus.DISABLED
        ) {
          await tx.quotation.update({
            where: {
              id: quotation?.id ?? '',
            },
            data: {
              quotationStatus: QuotationStatus.EXPIRED,
            },
          });
        } else if (
          carData.carStatus === CarStatus.APPROVED &&
          quotation?.quotationStatus === QuotationStatus.PAID
        ) {
          await this.prismaService.quotation.update({
            where: {
              id: quotation.id,
            },
            data: {
              quotationStatus: QuotationStatus.ACTIVE,
            },
          });
        } else if (
          carData.carStatus === CarStatus.APPROVED &&
          quotation?.quotationStatus !== QuotationStatus.ACTIVE &&
          !quotation?.quotationDetails?.expiryDate
        ) {
          await tx.quotation.update({
            where: {
              id: quotation.id,
            },
            data: {
              quotationStatus: QuotationStatus.ACTIVE,
            },
          });

          await tx.quotationDetails.update({
            where: {
              quotationId: quotation.id,
            },
            data: {
              expiryDate: this.helperService.getExpiryDate(
                quotation.quotationDetails.validityDays,
              ),
              startDate: new Date(),
            },
          });
        }
      });

      return {
        message: `Car status updated to ${carData.carStatus.toLowerCase()} successfully`,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async addCarProduct({
    carId,
    fileType,
    documentType,
    files,
    amount,
    discountedAmount,
    id,
  }: {
    carId: string;
    fileType: string;
    documentType: DocumentType;
    files: FileUpload[];
    amount: number;
    discountedAmount?: number;
    id?: string;
  }): Promise<Response> {
    try {
      const isCarExist = await this.prismaService.car.findUnique({
        where: { id: carId },
      });
      if (!isCarExist) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Car'),
        );
      }
      const keys: { id?: string; path: string; fileName: string }[] = [];
      for await (const file of files) {
        const fileName = await file.filename;
        if (documentType === DocumentType.VIDEO) {
          const response = await this.helperService.uploadVimeoVideo({
            file: file,
          });
          keys.push({ id: response.id, path: response.path, fileName });
        } else {
          const uploadCategory =
            documentType === DocumentType.DOCUMENT
              ? FileType.DOCUMENTS
              : FileType.IMAGES;
          const path = await this.awsService.uploadFile({
            file: await file,
            uploadCategory,
            id: carId,
          });
          keys.push({ path, fileName });
        }
      }

      const car = await this.prismaService.carProduct.upsert({
        where: {
          id: id ?? '',
        },
        update: {
          fileType,
          amount,
          discountedAmount: discountedAmount ?? amount,
          carId,
          carProductDocuments: {
            create: keys.map((key) => ({
              fileName: key.fileName,
              documentType,
              path: key.path,
              ...(key.id ? { videoVimeoId: key.id } : {}),
            })),
          },
        },
        create: {
          fileType,
          amount,
          discountedAmount: discountedAmount ?? amount,
          carId,
          carProductDocuments: {
            create: keys.map((key) => ({
              fileName: key.fileName,
              documentType,
              path: key.path,
              ...(key.id ? { videoVimeoId: key.id } : {}),
            })),
          },
        },
        include: {
          carProductDocuments: true,
        },
      });

      // Add the product to clients who have already bought the product
      for await (const doc of car.carProductDocuments) {
        const existingClients =
          await this.prismaService.productsPurchased.findMany({
            where: {
              carProduct: {
                id: doc.id,
              },
              carId: carId,
            },
          });

        if (existingClients?.length) {
          for await (const client of existingClients) {
            await this.prismaService.productsPurchased.create({
              data: {
                carProductId: doc.id,
                carId: client.carId,
                userId: client.userId,
              },
            });
          }
        }
      }

      return {
        message: `Car product uploaded successfully`,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async addCarGalleryDocuments({
    carId,
    documentType,
    fileType,
    keys,
    isThumbnail,
  }: {
    carId: string;
    documentType: DocumentType;
    fileType: string;
    keys:
      | { path: string; fileName: string }[]
      | { file: FileUpload; fileName: string }[];
    id?: string;
    isThumbnail: boolean;
  }): Promise<Response> {
    try {
      const isCarExist = await this.prismaService.car.findUnique({
        where: { id: carId },
      });
      if (!isCarExist) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Car'),
        );
      }

      // check if a gallery exists
      const gallery = await this.prismaService.carGallery.findFirst({
        where: {
          fileType: {
            in: [fileType, fileType.toUpperCase(), fileType.toLowerCase()],
          },
          carId,
        },
      });

      if (documentType === DocumentType.VIDEO) {
        for await (const file of keys as {
          file: FileUpload;
          fileName: string;
        }[]) {
          const response = await this.helperService.uploadVimeoVideo({
            file: file.file,
          });
          if (gallery) {
            await this.prismaService.carGalleryDocuments.create({
              data: {
                fileName: file.fileName,
                documentType,
                path: response.path,
                carGalleryId: gallery.id,
                videoVimeoId: response.id,
              },
            });
          } else {
            await this.prismaService.carGallery.create({
              data: {
                carId,
                fileType,
                thumbnail: isThumbnail,
                carGalleryDocuments: {
                  create: {
                    fileName: file.fileName,
                    documentType,
                    path: response.path,
                  },
                },
              },
            });
          }
        }
      } else {
        if (gallery) {
          await this.prismaService.carGalleryDocuments.createMany({
            data: keys.map((key) => ({
              fileName: key.fileName,
              documentType,
              path: key.path,
              carGalleryId: gallery.id,
            })),
          });
        } else {
          await this.prismaService.carGallery.create({
            data: {
              carId,
              fileType,
              thumbnail: isThumbnail,
              carGalleryDocuments: {
                create: keys.map((key) => ({
                  fileName: key.fileName,
                  documentType,
                  path: key.path,
                })),
              },
            },
          });
        }
      }

      return {
        message: `Car ${fileType} uploaded successfully`,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async uploadThumbnail({
    documentId,
    file,
    documentType,
  }: {
    documentId: string;
    file: FileUpload;
    documentType: DocumentType;
  }): Promise<Response> {
    try {
      let docDetails = null;
      let url = null;

      const productDoc = await this.prismaService.carProduct.findUnique({
        where: {
          id: documentId,
          deleted: false,
        },
      });
      if (productDoc) {
        docDetails = productDoc;
      }

      const galleryDoc = await this.prismaService.carGallery.findUnique({
        where: {
          id: documentId,
        },
      });
      if (galleryDoc) {
        docDetails = galleryDoc;
      }

      const bundleDoc = await this.prismaService.carProduct.findUnique({
        where: {
          id: documentId,
        },
      });
      if (bundleDoc) {
        docDetails = bundleDoc;
      }

      if (documentType === DocumentType.VIDEO) {
        url = await this.helperService.uploadVimeoVideoThumbnail({
          videoVimeoId: docDetails.vimeoVideoId,
          file,
        });
      } else {
        url = await this.awsService.uploadFile({
          file,
          uploadCategory: FileType.IMAGES,
          id: docDetails.id,
        });
      }
      if (productDoc) {
        await this.prismaService.carProduct.update({
          where: {
            id: documentId,
            deleted: false,
          },
          data: {
            thumbnail: url,
          },
        });
      } else if (galleryDoc) {
        await this.prismaService.carGallery.update({
          where: {
            id: documentId,
          },
          data: {
            thumbnail: url,
          },
        });
      } else if (bundleDoc) {
        await this.prismaService.carProduct.update({
          where: {
            id: documentId,
          },
          data: {
            thumbnail: url,
          },
        });
      }

      return { message: 'Thumbnail uploaded successfully', success: true };
    } catch (error) {
      throw error;
    }
  }

  // this helper function is used to filter in car model and company name clause
  companyNameModelClauseFun(operator: string, value: string[]) {
    const companyNameModelClause = {
      ...(operator === filterOperators.stringOperators.contains
        ? {
            OR: [
              {
                companyName: {
                  contains: value[0],
                  mode: 'insensitive',
                },
              },
              {
                model: {
                  contains: value[0],
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
      ...(operator === filterOperators.stringOperators.notContains
        ? {
            AND: [
              {
                companyName: {
                  not: {
                    contains: value[0],
                    mode: 'insensitive',
                  },
                },
              },
              {
                model: {
                  not: {
                    contains: value[0],
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {}),
      ...(operator === filterOperators.stringOperators.equal
        ? {
            AND: [
              {
                companyName: value[0].split('/')[0]?.trim(),
              },
              {
                model: value[0].split('/')[1]?.trim(),
              },
            ],
          }
        : {}),
      ...(operator === filterOperators.stringOperators.notEqual
        ? {
            AND: [
              {
                companyName: {
                  not: { equals: value[0].split('/')[0]?.trim() },
                },
              },
              {
                model: { not: { equals: value[0].split('/')[1]?.trim() } },
              },
            ],
          }
        : {}),
      ...(operator === filterOperators.stringOperators.notNull
        ? {
            OR: [
              { companyName: { not: { equals: '' } } },
              { model: { not: { equals: '' } } },
            ],
          }
        : {}),
      ...(operator === filterOperators.stringOperators.null
        ? {
            AND: [{ companyName: '' }, { model: '' }],
          }
        : {}),
      ...(operator === filterOperators.stringOperators.startsWith
        ? {
            companyName: {
              startsWith: value[0],
              mode: 'insensitive',
            },
          }
        : {}),
      ...(operator === filterOperators.stringOperators.endsWith
        ? {
            model: {
              endsWith: value[0],
              mode: 'insensitive',
            },
          }
        : {}),
      ...(operator === filterOperators.stringOperators.in
        ? {
            OR: value.map((entry) => {
              const [companyName, model] = entry
                .split(' / ')
                .map((s) => s.trim());
              return {
                OR: [
                  {
                    companyName: companyName,
                  },
                  {
                    model: model,
                  },
                ],
              };
            }),
          }
        : {}),
    };
    return companyNameModelClause;
  }

  //this service handles 6 endpoints -> getCarDetailUser, getCarsUser, getCarDetailDealer, getCarsDealer, getCarDetailAdmin, getCarsAdmin
  async getCars({
    carId,
    pagination,
    role,
    dealerId,
    userId,
    filter,
    searchString,
  }: {
    carId?: string;
    pagination?: PaginationInput;
    role: string;
    dealerId?: string;
    userId?: string;
    filter?: CarsFilterInput[];
    searchString?: string;
  }): Promise<GetAllCarsAdmin | GetAllCarsDealer | GetAllCarsUser> {
    try {
      let whereParam = null;
      if (role === Roles.DEALER && dealerId) {
        whereParam = { userId: dealerId };
      }

      if (carId) {
        const car = await this.prismaService.car.findUnique({
          where: { id: carId },
        });
        if (!car) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.notFound('Car'),
          );
        }
        whereParam = {
          ...whereParam,
          id: carId,
        };
      }

      if (filter?.length) {
        const carFilter = [];
        let companyNameModelClause = null;
        const userFilter = filter.filter((data) => {
          if (getColumnNames({ tableName: 'Car' })[data.column]) {
            if (data.column === CarTableFilter.companyName) {
              companyNameModelClause = this.companyNameModelClauseFun(
                data.operator,
                data.value as string[],
              );
            } else carFilter.push(data);
          } else if (getColumnNames({ tableName: 'User' })[data.column]) {
            return data;
          }
        });

        whereParam = {
          ...whereParam,
          ...this.filterService.getFilteredData({ fields: carFilter }),
          user: {
            ...this.filterService.getFilteredData({ fields: userFilter }),
          },
        };
        if (whereParam?.AND && companyNameModelClause?.AND) {
          whereParam.AND = [...whereParam.AND, ...companyNameModelClause.AND];
        } else {
          whereParam = {
            ...whereParam,
            ...companyNameModelClause,
          };
        }
      }
      if (searchString) {
        if (!whereParam?.AND) {
          whereParam = { ...whereParam, AND: [] };
        }

        const orConditions: any[] = [
          {
            model: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            variant: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            companyName: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
        ];

        if (role === Roles.DEALER) {
          orConditions.push({
            registrationNumber: {
              contains: searchString,
              mode: 'insensitive',
            },
          });
        }

        whereParam.AND.push({
          OR: orConditions,
        });
      }

      if (role === Roles.USER) {
        whereParam = {
          ...whereParam,
          carStatus: {
            in: [
              CarStatus.APPROVED,
              ...(carId ? [CarStatus.DISABLED, CarStatus.SOLD] : []),
            ],
          },
        };
      }

      if (role === Roles.DEALER) {
        whereParam = { ...whereParam };
      }

      let userBoughtBundles = [];
      if (userId) {
        const userBundles = await this.prismaService.invoiceRecord.findMany({
          where: {
            carId,
            userId,
            invoiceStatus: RazorpayOrderStatus.PAID,
            bundleId: {
              not: null,
            },
          },
        });
        if (userBundles?.length) {
          userBoughtBundles = userBundles.map((bundle) => bundle.bundleId);
        }
      }

      let offset = 0,
        take = 1;
      if (pagination) {
        offset = (pagination.page - 1) * pagination.limit;
        take = pagination.limit;
      }
      const allCars = await this.prismaService.car.findMany({
        where: { ...whereParam },
        include: {
          products: {
            where: {
              deleted: false,
            },
            include: {
              carProductDocuments: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          carGallery: {
            include: {
              carGalleryDocuments: true,
            },
          },
          user: true,
          quotation: {
            include: {
              quotationDetails: true,
            },
            orderBy: {
              createdAt: 'desc', // Sort by createdAt field in descending order (newest first)
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take,
      });

      if (carId && !allCars.length) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Car'),
        );
      }

      const modifiedCarData = [];
      for (const car of allCars) {
        const productUrls = [];
        const galleryUrls = [];

        for (const data of car.products) {
          if (role === Roles.USER) {
            let findDoc = null;
            if (userId) {
              findDoc = await this.prismaService.productsPurchased.findFirst({
                where: {
                  userId,
                  carProductId: data.id,
                },
                include: {
                  carProduct: {
                    include: {
                      carProductDocuments: true,
                    },
                  },
                },
              });
            }

            if (findDoc?.id) {
              productUrls.push({
                ...data,
                documents: this.awsService.signedProductDocuments(
                  findDoc.carProduct.carProductDocuments,
                ),
                thumbnail: findDoc?.carProduct?.thumbnail
                  ? this.awsService.signedThumbnail(
                      findDoc.carProduct.thumbnail,
                    )
                  : null,
              });
            } else {
              if (!userBoughtBundles.includes(data.id)) {
                productUrls.push({
                  id: data.id,
                  fileType: data.fileType,
                  amount: data.amount,
                  discountedAmount: data.discountedAmount,
                  currency: data.currency,
                  productType: data.productType,
                  thumbnail: data?.thumbnail
                    ? this.awsService.signedThumbnail(data.thumbnail)
                    : null,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                });
              }
            }
          } else if (role === Roles.ADMIN) {
            productUrls.push({
              ...data,
              documents: this.awsService.signedProductDocuments(
                data.carProductDocuments,
              ),
              thumbnail: data.thumbnail
                ? this.awsService.signedThumbnail(data.thumbnail)
                : null,
            });
          } else {
            productUrls.push({ ...data });
          }
        }

        for (const data of car.carGallery) {
          galleryUrls.push({
            ...data,
            documents: this.awsService.signedGalleryDocuments(
              data.carGalleryDocuments,
            ),
            thumbnail: data?.thumbnail,
          });
        }

        modifiedCarData.push({
          ...car,
          products: productUrls,
          gallery: galleryUrls,
        });
      }

      const allCarsCount = await this.prismaService.car.count({
        where: { ...whereParam },
      });

      if (role === Roles.USER) {
        return Object.assign(new GetAllCarsUser(), {
          data: modifiedCarData ?? [],
          pagination: pagination
            ? {
                maxPage: Math.ceil(allCarsCount / pagination.limit),
                currentPage: pagination.page,
                total: allCarsCount,
                limit: pagination.limit,
              }
            : null,
          message: 'All cars data',
          success: true,
        });
      } else if (role === Roles.DEALER) {
        return Object.assign(new GetAllCarsDealer(), {
          data: modifiedCarData ?? [],
          pagination: pagination
            ? {
                maxPage: Math.ceil(allCarsCount / pagination.limit),
                currentPage: pagination.page,
                total: allCarsCount,
                limit: pagination.limit,
              }
            : null,
          message: 'All cars data',
          success: true,
        });
      } else if (role === Roles.ADMIN) {
        return Object.assign(new GetAllCarsAdmin(), {
          data: modifiedCarData ?? [],
          pagination: pagination
            ? {
                maxPage: Math.ceil(allCarsCount / pagination.limit),
                currentPage: pagination.page,
                total: allCarsCount,
                limit: pagination.limit,
              }
            : null,
          message: 'All cars data',
          success: true,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getCarsAnalyticsReport(
    input: CarAnalytics,
  ): Promise<CarAnalyticsResponse> {
    try {
      const { carId, lead, views, product } = input;
      const carData = await this.prismaService.car.findUnique({
        where: { id: carId },
      });
      if (!carData) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Car'),
        );
      }

      const totalActiveQuotationCount =
        await this.prismaService.quotation.count({
          where: { carId, quotationStatus: QuotationStatus.ACTIVE },
        });

      const totalPendingQuotationCount =
        await this.prismaService.quotation.count({
          where: { carId, quotationStatus: QuotationStatus.PENDING },
        });

      const totalCancelledQuotationCount =
        await this.prismaService.quotation.count({
          where: { carId, quotationStatus: QuotationStatus.CANCELLED },
        });

      const totalExpiredQuotationCount =
        await this.prismaService.quotation.count({
          where: { carId, quotationStatus: QuotationStatus.EXPIRED },
        });

      const totalLeadCount = await this.prismaService.leads.count({
        where: { carId },
      });

      const totalLeadsInRange = await this.prismaService.leads.findMany({
        where: {
          carId,
          AND: [
            lead?.start ? { createdAt: { gte: lead.start } } : {},
            lead?.end ? { createdAt: { lte: lead.end } } : {},
          ],
        },
        orderBy: {
          createdAt: 'asc', // 'desc' for newest first
        },
      });

      const totalViewCount = await this.prismaService.userAnalytics.count({
        where: {
          operation: 'Query -> getCarDetailUser',
          arguments: { string_contains: carId },
        },
      });

      const totalViewsInRange = await this.prismaService.userAnalytics.findMany(
        {
          where: {
            operation: 'Query -> getCarDetailUser',
            arguments: { string_contains: carId },
            AND: [
              views?.start ? { createdAt: { gte: views.start } } : {},
              views?.end ? { createdAt: { lte: views.end } } : {},
            ],
          },
          orderBy: {
            createdAt: 'asc', // 'desc' for newest first
          },
        },
      );

      const totalProductSold = await this.prismaService.invoiceRecord.findMany({
        where: {
          carId,
        },
        include: {
          car: true,
        },
      });

      const totalProductsSoldCount = totalProductSold.length;
      let totalRevenue = 0;
      const productsSold: { [key: string]: number } = {};

      const bundleIds = totalProductSold
        .map((eachProduct) => eachProduct.bundleId)
        .filter(Boolean);
      const productIds = totalProductSold.flatMap(
        (eachProduct) => eachProduct.productsPurchased,
      );

      const [bundleDetails, productDetails] = await Promise.all([
        this.prismaService.carProduct.findMany({
          where: {
            id: { in: bundleIds },
          },
        }),
        this.prismaService.carProduct.findMany({
          where: {
            id: { in: productIds },
          },
        }),
      ]);

      const bundleMap = new Map(
        bundleDetails.map((bundle) => [bundle.id, bundle]),
      );
      const productMap = new Map(
        productDetails.map((product) => [product.id, product]),
      );

      totalProductSold.forEach((eachProduct) => {
        if (eachProduct.bundleId) {
          const bundle = bundleMap.get(eachProduct.bundleId);
          if (bundle) {
            totalRevenue += bundle.amount;
            productsSold[bundle.fileType] =
              (productsSold[bundle.fileType] || 0) + 1;
          }
        } else {
          eachProduct.productsPurchased.forEach((productId) => {
            const product = productMap.get(productId);
            if (product) {
              totalRevenue += product.amount;
              productsSold[product.fileType] =
                (productsSold[product.fileType] || 0) + 1;
            }
          });
        }
      });

      const sales = Object.entries(productsSold).map(([fileType, count]) => ({
        fileType,
        count: Number(count),
      }));

      const totalProductSoldInRange =
        await this.prismaService.productsPurchased.findMany({
          where: {
            carId,
            AND: [
              product?.start ? { createdAt: { gte: product.start } } : {},
              product?.end ? { createdAt: { lte: product.end } } : {},
            ],
          },
          orderBy: {
            createdAt: 'asc', // 'desc' for newest first
          },
        });

      return {
        data: {
          quotationDetails: {
            totalActiveQuotationCount,
            totalPendingQuotationCount,
            totalCancelledQuotationCount,
            totalExpiredQuotationCount,
          },
          productDetails: {
            totalRevenue,
            totalProductsSoldCount,
            sales,
          },
          totalProductSoldInRange,
          totalLeadCount,
          totalViewCount,
          totalViewsInRange,
          totalLeadsInRange,
        },
        message: 'Car analytics data.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCarViewers(
    carId: string,
    pagination?: PaginationInput,
  ): Promise<CarViewers> {
    try {
      let offset = 0,
        take = 1;

      if (pagination) {
        offset = (pagination.page - 1) * pagination.limit;
        take = pagination.limit;
      }

      // Fetch grouped unique viewers
      const uniqueViewers = await this.prismaService.userAnalytics.groupBy({
        where: {
          operation: 'Query -> getCarDetailUser',
          arguments: { string_contains: carId },
        },
        by: ['userId', 'ipAddress'],
        _count: {
          userId: true,
          ipAddress: true,
        },
        orderBy: {
          ipAddress: 'desc',
        },
        _max: {
          userAgent: true,
          updatedAt: true,
          id: true,
        },
        skip: offset,
        take,
      });

      // Fetch total unique viewer count
      const allViewerCount = (
        await this.prismaService.userAnalytics.groupBy({
          where: {
            operation: 'Query -> getCarDetailUser',
            arguments: { string_contains: carId },
          },
          by: ['ipAddress', 'userId'],
        })
      ).length;

      // Fetch related users in batch
      const userIds = uniqueViewers
        .map((viewer) => viewer.userId)
        .filter((id): id is string => Boolean(id));

      const users = await this.prismaService.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, firstName: true, lastName: true },
      });

      const userMap = users.reduce(
        (acc, user) => {
          acc[user.id] = user;
          return acc;
        },
        {} as Record<string, { firstName: string; lastName: string }>,
      );

      // Map the final viewers
      const modifiedUniqueViewers = uniqueViewers.map((eachViewer) => ({
        rowId: eachViewer._max.id,
        ipAddress: eachViewer.ipAddress,
        viewsCount: eachViewer._count.ipAddress,
        userAgent: eachViewer._max.userAgent,
        userId: eachViewer.userId,
        user: eachViewer.userId ? userMap[eachViewer.userId] : null,
        latestViewedAt: eachViewer._max.updatedAt,
      }));

      return {
        data: modifiedUniqueViewers,
        pagination: pagination
          ? {
              maxPage: Math.ceil(allViewerCount / pagination.limit),
              currentPage: pagination.page,
              total: allViewerCount,
              limit: pagination.limit,
            }
          : null,
        message: 'All car viewers.',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching car viewers:', error);
      throw new Error('Failed to fetch car viewers. Please try again later.');
    }
  }

  async getCarListViewedByUser(userId: string, pagination?: PaginationInput) {
    try {
      let offset = 0,
        take = 1;
      if (pagination) {
        offset = (pagination.page - 1) * pagination.limit;
        take = pagination.limit;
      }

      const carsIds = await this.prismaService.userAnalytics.findMany({
        select: {
          arguments: true,
        },
        where: {
          operation: 'Query -> getCarDetailUser',
          userId: userId,
        },
      });

      if (!carsIds?.length) {
        return {
          data: [],
          message: 'No cars found',
          success: true,
        };
      }
      const carIds = Object.keys(
        carsIds.reduce((prev, curr) => {
          const parsedData = JSON.parse(curr.arguments as string);
          const carId = parsedData.carId;
          prev[carId] = {};
          return prev;
        }, {}),
      );
      const viewedCars = await this.prismaService.car.findMany({
        where: {
          id: {
            in: carIds,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
          quotation: {
            include: {
              quotationDetails: true,
            },
            orderBy: {
              createdAt: 'desc', // Sort by createdAt field in descending order (newest first)
            },
          },
        },
        skip: offset,
        take,
      });
      return {
        data: viewedCars,
        message: 'User viewed cars',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCarBundles({
    carId,
    userId,
    role,
    bundleId,
  }: {
    carId: string;
    userId?: string;
    role?: Roles;
    bundleId?: string;
  }) {
    try {
      await this.checkerService.getCarById({ id: carId });

      let whereParam = null;
      whereParam = {
        carId,
        deleted: false,
        productType: ProductType.BUNDLE,
      };

      if (bundleId) {
        whereParam = {
          ...whereParam,
          id: bundleId,
        };
      }

      if (userId) {
        const userBundles = await this.prismaService.invoiceRecord.findMany({
          where: {
            carId,
            userId,
            bundleId: {
              not: null,
            },
          },
        });
        if (userBundles?.length) {
          const userBoughtBundles = userBundles.map(
            (bundle) => bundle.bundleId,
          );
          whereParam = {
            ...whereParam,
            id: {
              notIn: userBoughtBundles,
            },
          };
        }
      }

      const bundles = await this.prismaService.carProduct.findMany({
        where: whereParam,
        include: {
          bundledItems: {
            include: {
              carProduct: {
                include: {
                  carProductDocuments: true,
                },
              },
            },
          },
        },
      });

      let data = bundles.map((bundle) => {
        const thumbnail = bundle?.thumbnail
          ? this.awsService.signedThumbnail(bundle.thumbnail)
          : null;

        return {
          ...bundle,
          thumbnail,
        };
      });

      const updatedBundles = [];
      for (const bundle of data) {
        const updatedBundleItems = [];

        for (const bundleItem of bundle.bundledItems) {
          const updatedCarProductDocuments =
            this.awsService.signedProductDocuments(
              bundleItem.carProduct.carProductDocuments,
            );
          updatedBundleItems.push({
            ...bundleItem,
            CarProduct: {
              ...bundleItem.carProduct,
              carProductDocuments:
                role && role === Roles.ADMIN
                  ? updatedCarProductDocuments
                  : null,
            },
          });
        }

        updatedBundles.push({
          ...bundle,
          bundledItems: updatedBundleItems,
        });
      }

      data = updatedBundles;

      return {
        data,
        message: 'Car bundles',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
}
