import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HelperService } from 'src/helper/helper.service';
import { Mode, QuotationStatus, Roles, UserStatus } from '@prisma/client';
import { Response } from 'src/common/model/response.model';
import { ConfigService } from '@nestjs/config';
import { UpdateDealerInput, UpdateUserInput } from './dto/update-user.dto';
import { CheckerService } from 'src/checker/checker.service';
import {
  GetDealerQuotation,
  ModifiedGetDealerQuotations,
} from './model/dealer-quotation.model';
import { PaginationInput } from 'src/common/dto/pagination.dto';

import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { GraphQLError } from 'graphql';
import { UserPaymentLogs } from 'src/common/model/all-payment-log-dealer.model';
import { AllUsers, User, UserDetails } from 'src/common/model/user.model';
import { UpdateDealer } from './model/update-dealer.model';
import { DeleteDocType } from 'src/common/enum/delete-doc-type.enum';
import { UpdateEndUser } from './model/update-user.model';
import { UserAnalytics } from './dto/user-analytics.dto';
import { UserAnalyticsReport } from './model/user-analytics.model';
import { UserInvoiceFilterInput } from './dto/user-payment-invoice-filter.dto';
import { FilterService } from 'src/filter/filter.service';
import { AWSService } from 'src/AWS/aws.service';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FileUpload } from 'graphql-upload';
import { FileType } from 'src/common/types/upload-file-type';
@Injectable()
export class UserService {
  constructor(
    private emailNotificationService: EmailNotificationService,
    private prismaService: PrismaService,
    private helperService: HelperService,
    private awsService: AWSService,
    private readonly configService: ConfigService,
    private checkerService: CheckerService,
    private filterService: FilterService,
  ) {}

  async getAllCustomers(
    pagination?: PaginationInput,
    filter?: UserInvoiceFilterInput[],
  ): Promise<AllUsers> {
    try {
      let whereParam = null;

      if (filter?.length) {
        const filteredWhereClause = this.filterService.getFilteredData({
          fields: filter,
        });
        whereParam = {
          ...filteredWhereClause,
        };
      }

      let offset = 0,
        take = 1;

      if (pagination) {
        offset = (pagination.page - 1) * pagination.limit;
        take = pagination.limit;
      }

      const allCustomers = await this.prismaService.user.findMany({
        where: { role: Roles.USER, ...whereParam },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take,
      });

      if (!allCustomers.length) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('User'),
        );
      }

      const customerCount = await this.prismaService.user.count({
        where: { role: Roles.USER, ...whereParam },
      });

      return {
        data: allCustomers,
        pagination: pagination
          ? {
              maxPage: Math.ceil(customerCount / pagination.limit),
              currentPage: pagination.page,
              total: customerCount,
              limit: pagination.limit,
            }
          : null,
        message: 'All customers.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCustomersDetails(userId: string): Promise<UserDetails> {
    try {
      const UserDetails = await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          documents: true,
        },
      });
      if (!UserDetails.id && !userId) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.invalid('user'),
        );
      }
      return {
        data: UserDetails,
        message: 'User details.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDealerStatus({
    id,
    updatedStatus,
  }: {
    id: string;
    updatedStatus: UserStatus;
  }): Promise<Response> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
        include: { documents: true },
      });

      if (!user) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('User'),
        );
      }

      if (user.userStatus === updatedStatus) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom(
            `${user.role} status is already ${updatedStatus.toLowerCase()}`,
          ),
        );
      }

      if (updatedStatus === UserStatus.APPROVED && user.documents.length <= 0) {
        throw new CustomError(
          StatusCodes.NOT_ACCEPTABLE,
          ErrorMessage.notFound('Documents'),
        );
      }

      await this.prismaService.user.update({
        where: { id },
        data: { userStatus: updatedStatus },
      });

      // notifying admin
      const emailTemplatePath = path.join(
        path.resolve(),
        'public',
        'templates',
        'dealerStatusChange.html',
      );
      const htmlTemplate = await fs.readFile(emailTemplatePath, 'utf8');
      await this.emailNotificationService.sendMail({
        recipientEmail: this.configService.get<string>('ADMIN_EMAIL'),
        emailTemplate: htmlTemplate,
        subject: 'Change Dealer Status',
        name: `${user.firstName} ${user.lastName ?? ''}`,
        message: `Your status has been changed from ${user.userStatus} to ${updatedStatus}`,
        email: `${user.email}`,
        phone: `${user.phoneNumber}`,
      });

      return {
        message: `Dealer ${updatedStatus.toLowerCase()} successfully`,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDealer({
    input,
    user,
  }: {
    input: UpdateDealerInput;
    user: User;
  }): Promise<UpdateDealer> {
    try {
      const { dealerId, file, ...remainingFields } = input;
      if (!user && !dealerId) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.invalid('User'),
        );
      }
      if (dealerId && (!input.firstName || !input.lastName)) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.invalid('name'),
        );
      }
      const UserDetails = user
        ? user
        : await this.prismaService.user.findUnique({
            where: { id: dealerId },
          });
      const { email } = remainingFields;
      if (email && UserDetails?.email) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notEditable('Email'),
        );
      }
      if (!user) {
        const fieldsToCheck = [
          {
            value: input.firstName,
            dbValue: UserDetails.firstName,
            error: 'First name',
          },
          {
            value: input.lastName,
            dbValue: UserDetails.lastName,
            error: 'Last name',
          },
          {
            value: input.companyName,
            dbValue: UserDetails.companyName,
            error: 'Company name',
          },
          {
            value: input.location,
            dbValue: UserDetails.location,
            error: 'Location',
          },
          {
            value: input.email,
            dbValue: UserDetails.email,
            error: 'Email',
          },
        ];

        for (const { value, dbValue, error } of fieldsToCheck) {
          if (value && dbValue) {
            throw new CustomError(
              StatusCodes.BAD_REQUEST,
              ErrorMessage.notEditable(error),
            );
          }
        }
      }
      let profileImageKey = null;
      if (file) {
        profileImageKey = await this.updateProfileImage({ user, file });
      }
      const updatedDealer = await this.prismaService.user.update({
        where: {
          id: UserDetails.id,
        },
        data: {
          ...remainingFields,
          role: Roles.DEALER,
          profileImage: profileImageKey,
        },
      });

      return {
        message: 'Dealer updated successfully.',
        success: true,
        data: {
          ...updatedDealer,
          profileImage: profileImageKey
            ? this.awsService.getGalleryFileUrl(profileImageKey)
            : null,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async addDealerDocument({
    dealerId,
    keys,
    fileType,
  }: {
    dealerId: string;
    keys: { path: string; fileName: string }[];
    fileType: string;
  }): Promise<Response> {
    try {
      const isDealerExist = await this.prismaService.user.findUnique({
        where: { id: dealerId, role: Roles.DEALER },
      });
      if (!isDealerExist) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Dealer'),
        );
      }

      await this.prismaService.userDocuments.createMany({
        data: keys.map((key) => ({
          userId: dealerId,
          fileName: key.fileName,
          fileType,
          path: key.path,
        })),
      });

      return {
        message: 'Dealer document upload successfully.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async sendEmailOtp({
    email,
    userId,
  }: {
    email: string;
    userId: string;
  }): Promise<Response> {
    try {
      const otp = this.helperService.generateOTP(6);

      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user?.id) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('User'),
        );
      }

      const emailAlreadyVerified = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (emailAlreadyVerified?.id) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.alreadyExists('Email'),
        );
      }

      await this.prismaService.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            email,
          },
        });

        await tx.otpVerification.upsert({
          where: {
            desc: email,
          },
          create: {
            otp,
            mode: Mode.EMAIL,
            desc: email,
          },
          update: {
            otp,
            mode: Mode.EMAIL,
            desc: email,
          },
        });
      });

      const emailTemplatePath = path.join(
        path.resolve(),
        'public',
        'templates',
        'otp.html',
      );
      const htmlTemplate = await fs.readFile(emailTemplatePath, {
        encoding: 'utf8',
      });

      await this.emailNotificationService.sendMail({
        recipientEmail: email,
        emailTemplate: htmlTemplate,
        subject: 'Welcome to x-cars! Your Verification Code',
        otp,
      });

      return {
        message: `Otp sent successfully at ${email}.`,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail({
    email,
    otp,
    userId,
  }: {
    email: string;
    otp: string;
    userId: string;
  }): Promise<Response> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user?.id) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('User'),
        );
      }

      const findOtp = await this.prismaService.otpVerification.findUnique({
        where: {
          desc: email,
        },
      });

      if (!findOtp?.id) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.tryAgain('new OTP'),
        );
      }

      if (findOtp.otp !== otp) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.invalid('OTP'),
        );
      }

      await this.prismaService.$transaction(async (tx) => {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            isEmailConfirmed: true,
          },
        });

        await tx.otpVerification.delete({
          where: {
            desc: email,
          },
        });
      });

      return {
        message: 'Email verified successfully.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDealerQuotations({
    userId,
    carId,
    statusArr,
    pagination,
  }: {
    userId: string;
    carId?: string;
    statusArr?: [QuotationStatus];
    pagination?: PaginationInput;
  }): Promise<ModifiedGetDealerQuotations> {
    try {
      let whereParam = null;

      const user = await this.checkerService.getUserById({ id: userId });

      whereParam = {
        dealerId: user.id,
      };

      if (carId) {
        whereParam = {
          ...whereParam,
          carId,
        };
      }

      if (statusArr) {
        whereParam = {
          ...whereParam,
          quotationStatus: {
            in: statusArr,
          },
        };
      }

      const userQuotations = await this.prismaService.quotation.findMany({
        where: whereParam,
        include: {
          quotationDetails: true,
          car: true,
          adminDetail: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      let data = this.helperService.modifyQuotationData(userQuotations);

      const totalRecords = data.length;
      const totalPages = Math.ceil(totalRecords / pagination.limit);
      const offset = (pagination.page - 1) * pagination.limit;

      data = data.slice(offset, offset + pagination.limit);

      return {
        data,
        pagination: {
          maxPage: totalPages,
          currentPage: pagination.page,
          total: totalRecords,
          limit: pagination.limit,
        },
        message: 'Dealer quotation.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDealerQuotation({
    dealerId,
    quotationId,
  }: {
    dealerId: string;
    quotationId: string;
  }): Promise<GetDealerQuotation> {
    try {
      const user = await this.checkerService.getUserById({ id: dealerId });

      const userQuotation = await this.prismaService.quotation.findUnique({
        where: {
          id: quotationId,
          dealerId: user.id,
        },
        include: {
          quotationDetails: true,
          adminDetail: true,
        },
      });

      if (!userQuotation?.id) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Quotation'),
        );
      }

      return {
        dealerQuotationDetails: userQuotation,
        message: 'Dealer quotation.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPaymentHistoryList({
    userId,
    paymentId,
    role,
    pagination,
    filter,
  }: {
    userId: string;
    paymentId?: string;
    role: Roles;
    pagination?: PaginationInput;
    filter?: UserInvoiceFilterInput[];
  }): Promise<UserPaymentLogs> {
    try {
      let whereParam = null;
      let offset = null;
      let invoices = null;

      whereParam = role !== Roles.DEALER && userId ? { userId } : {};

      if (pagination) {
        offset = (pagination.page - 1) * pagination.limit;
      }

      if (paymentId) {
        whereParam = {
          ...whereParam,
          id: paymentId,
        };
      }

      if (role === Roles.DEALER) {
        const allQuotations = await this.prismaService.user.findMany({
          where: { id: userId },
          include: {
            quotation: true,
          },
        });

        if (!allQuotations.length) {
          throw new CustomError(
            StatusCodes.FORBIDDEN,
            ErrorMessage.notFound('Quotations'),
          );
        }

        const quotationIds = [];
        for (const data of allQuotations) {
          for (const quotation of data.quotation) {
            quotationIds.push(quotation.id);
          }
        }

        whereParam = {
          ...whereParam,
          quotationId: { in: quotationIds },
        };
      }

      if (filter?.length) {
        const filteredWhereClause = this.filterService.getFilteredData({
          fields: filter,
        });
        whereParam = {
          ...whereParam,
          ...filteredWhereClause,
        };
      }

      if (pagination) {
        invoices = await this.prismaService.invoiceRecord.findMany({
          where: whereParam,
          skip: offset,
          take: pagination.limit,
          orderBy: { createdAt: 'desc' },
          include: {
            quotation: { include: { car: true } },
            userDetail: true,
            car: true,
          },
        });
      } else {
        invoices = await this.prismaService.invoiceRecord.findMany({
          where: whereParam,
          orderBy: { createdAt: 'desc' },
          include: {
            quotation: { include: { car: true } },
            userDetail: true,
            car: true,
          },
        });
      }

      const invoiceCount = await this.prismaService.invoiceRecord.count({
        where: whereParam,
      });

      const modifiedData = [];
      for await (const invoice of invoices) {
        let productDetails = await this.prismaService.carProduct.findMany({
          where: {
            id: { in: invoice.productsPurchased },
          },
          include: {
            carProductDocuments: true,
          },
        });

        productDetails = productDetails.map((product) => {
          return {
            ...product,
            thumbnail: product?.thumbnail
              ? this.awsService.signedThumbnail(product.thumbnail)
              : null,
            documents: this.awsService.signedProductDocuments(
              product.carProductDocuments,
            ),
          };
        });

        let bundleDetails = null;

        if (invoice?.bundleId) {
          bundleDetails = await this.prismaService.carProduct.findUnique({
            where: {
              id: invoice?.bundleId,
            },
          });
        }
        modifiedData.push({
          ...invoice,
          userName:
            (invoice?.userDetail?.firstName || '') +
            ' ' +
            (invoice?.userDetail?.lastName || ''),
          userRole: invoice?.userDetail?.role,
          carDetail: invoice.car.companyName + ' / ' + invoice.car.model,
          bundleDetails,
          productsPurchased: productDetails,
          amount: invoice.amount / 100,
          amountPaid: invoice.amountPaid / 100,
          amountDue: invoice.amountDue / 100,
        });
      }

      return {
        data: modifiedData,
        pagination: pagination
          ? {
              maxPage: Math.ceil(invoiceCount / pagination.limit),
              currentPage: pagination.page,
              total: invoiceCount,
              limit: pagination.limit,
            }
          : null,
        message: 'User payment logs.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getDocumentPaths(
    documentIds: string[],
    docType: DeleteDocType,
  ): Promise<string[]> {
    try {
      let documents = [];
      if (docType === DeleteDocType.DEALER) {
        const docs = await this.prismaService.userDocuments.findMany({
          where: { id: { in: documentIds } },
          select: { path: true },
        });
        documents = docs.map((eachDoc) => eachDoc.path);
      } else {
        const products = await this.prismaService.carProductDocuments.findMany({
          where: {
            id: {
              in: documentIds,
            },
          },
        });
        const productPaths = products.map((product) => product.path);
        const gallery = await this.prismaService.carGalleryDocuments.findMany({
          where: {
            id: {
              in: documentIds,
            },
          },
        });
        const galleryPaths = gallery.map((eachDoc) => eachDoc.path);
        documents = [...productPaths, ...galleryPaths];
      }
      if (!documents.length) {
        throw new GraphQLError('No document found!', {
          extensions: {
            code: StatusCodes.BAD_REQUEST,
          },
        });
      }
      return documents;
    } catch (error) {
      throw error;
    }
  }

  async getProductDocumentPaths(productIds: string[]) {
    try {
      const productDetails = await this.prismaService.carProduct.findMany({
        where: {
          id: {
            in: productIds,
          },
          deleted: false,
        },
        include: {
          carProductDocuments: true,
        },
      });
      const paths = productDetails.flatMap((products) =>
        products.carProductDocuments.map((doc) => doc.path),
      );
      return paths;
    } catch (error) {
      throw error;
    }
  }

  async getGalleryDocumentPaths(productIds: string[]) {
    try {
      const galleryDetails = await this.prismaService.carGallery.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        include: {
          carGalleryDocuments: true,
        },
      });

      const paths = galleryDetails.flatMap((galleries) =>
        galleries.carGalleryDocuments.map((doc) => doc.path),
      );

      return paths;
    } catch (error) {
      throw error;
    }
  }

  async deleteGalleryItem(galleryItemId: string) {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const doc = await tx.carGalleryDocuments.findUnique({
          where: { id: galleryItemId },
          include: { carGallery: true },
        });
        if (!doc) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.notFound('Document'),
          );
        }
        const carGallery = await tx.carGallery.findUnique({
          where: { id: doc.carGallery.id },
          include: { carGalleryDocuments: true },
        });
        if (!carGallery) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.notFound('Gallery'),
          );
        }
        const response = await this.awsService.deleteFiles([doc.path]);
        if (!response.success) {
          throw new CustomError(StatusCodes.BAD_REQUEST, response.message);
        } else if (carGallery.carGalleryDocuments.length === 1) {
          const res = await tx.carGalleryDocuments.delete({
            where: { id: galleryItemId },
          });
          if (res) {
            await tx.carGallery.delete({
              where: { id: doc.carGallery.id },
            });
          }
        } else {
          await tx.carGalleryDocuments.delete({
            where: { id: galleryItemId },
          });
        }
      });
      return {
        success: true,
        message: 'Gallery item deleted successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(documentIds: string[]): Promise<Response> {
    try {
      await this.prismaService.carProduct.updateMany({
        where: { id: { in: documentIds } },
        data: {
          deleted: true,
        },
      });
      return {
        message: 'Product deleted successfully!',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteDealerDocument(documentId: string): Promise<Response> {
    try {
      const doc = await this.prismaService.userDocuments.findUnique({
        where: { id: documentId },
      });
      if (!doc) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Document'),
        );
      }
      const response = await this.awsService.deleteFiles([doc.path]);
      if (!response.success) {
        throw new CustomError(StatusCodes.BAD_REQUEST, response.message);
      }
      await this.prismaService.userDocuments.delete({
        where: { id: documentId },
      });
      return {
        message: 'Document deleted successfully!',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateEndUserDetail({
    updatedInput,
    user,
  }: {
    updatedInput: UpdateUserInput;
    user: User;
  }): Promise<UpdateEndUser> {
    try {
      if (!user) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.invalid('User'),
        );
      }
      const { file, ...remainingFields } = updatedInput;
      let profileImageKey = null;
      if (file) {
        profileImageKey = await this.updateProfileImage({ user, file });
      }
      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: { ...remainingFields, profileImage: profileImageKey },
      });
      return {
        success: true,
        message: 'User updated successfully!',
        data: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async userAnalytics({
    userId,
    input,
  }: {
    userId: string;
    input: UserAnalytics;
  }): Promise<UserAnalyticsReport> {
    try {
      const { leadRange, productPurchasedRange } = input;
      const leads = await this.prismaService.leads.findMany({
        where: {
          userId,
          AND: [
            leadRange?.start ? { createdAt: { gte: leadRange.start } } : {},
            leadRange?.end ? { createdAt: { lte: leadRange.end } } : {},
          ],
        },
        orderBy: {
          createdAt: 'asc', // 'desc' for newest first
        },
      });

      const totalCarsApplied = leads.length;

      const products = await this.prismaService.invoiceRecord.findMany({
        where: {
          userId,
          AND: [
            productPurchasedRange?.start
              ? { createdAt: { gte: productPurchasedRange.start } }
              : {},
            productPurchasedRange?.end
              ? { createdAt: { lte: productPurchasedRange.end } }
              : {},
          ],
        },
        include: {
          car: true,
        },
        orderBy: {
          createdAt: 'asc', // 'desc' for newest first
        },
      });

      let totalPaid = 0;
      const productsSold = {};
      if (products?.length) {
        for await (const eachProduct of products) {
          if (eachProduct.bundleId) {
            const bundleDetails =
              await this.prismaService.carProduct.findUnique({
                where: {
                  id: eachProduct.bundleId,
                },
              });
            totalPaid += bundleDetails?.amount;
          }
          for await (const productId of eachProduct.productsPurchased) {
            const productDetails =
              await this.prismaService.carProduct.findUnique({
                where: {
                  id: productId,
                },
              });
            if (!eachProduct.bundleId) {
              totalPaid += productDetails.amount;
            }
            productsSold[productDetails.fileType] = productsSold[
              productDetails.fileType
            ]
              ? productsSold[productDetails.fileType] + 1
              : 1;
          }
        }
      }

      const sales = Object.entries(productsSold).map(([fileType, count]) => ({
        fileType,
        count: Number(count),
      }));

      return {
        data: {
          totalCarsApplied,
          leads,
          products,
          productDetails: {
            totalPaid,
            sales,
          },
        },
        message: 'User analytics report',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProfileImage({
    user,
    file,
  }: {
    user: User;
    file: FileUpload;
  }): Promise<string> {
    try {
      if (!user) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.invalid('User'),
        );
      }

      const key = await this.awsService.uploadFile({
        file: await file,
        uploadCategory: FileType.PROFILE_IMAGE,
        id: user.id,
      });
      if (key && user.profileImage) {
        await this.awsService.deleteFiles([user.profileImage]);
      }
      return key;
    } catch (error) {
      throw error;
    }
  }

  async deleteProfileImage({ user }: { user: User }): Promise<Response> {
    try {
      if (!user.profileImage) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.invalid('request'),
        );
      }
      await this.awsService.deleteFiles([user.profileImage]);
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          profileImage: null,
        },
      });
      return {
        success: true,
        message: 'Profile image deleted successfully!',
      };
    } catch (error) {
      throw error;
    }
  }
}
