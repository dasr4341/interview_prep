import { Injectable } from '@nestjs/common';
import { DocumentType, ProductType } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { BundlePayment } from 'src/admin/dto/bundle-payment.dto';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckerService {
  constructor(private prismaService: PrismaService) {}

  async getQuotation({ quotationId }: { quotationId: string }) {
    try {
      const quotation = await this.prismaService.quotation.findUnique({
        where: {
          id: quotationId,
        },
        include: {
          adminDetail: true,
          quotationDetails: true,
          invoiceRecord: true,
        },
      });

      if (!quotation) {
        throw new GraphQLError('Quotation not found', {
          extensions: {
            code: StatusCodes.FORBIDDEN,
          },
        });
      }

      return quotation;
    } catch (error) {
      throw error;
    }
  }

  async validateToken({ token }: { token: string }) {
    try {
      const validToken = await this.prismaService.validTokens.findUnique({
        where: {
          token,
        },
      });

      if (!validToken) {
        throw new CustomError(
          StatusCodes.FORBIDDEN,
          ErrorMessage.invalid('action'),
        );
      }

      return validToken;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail({ email }: { email: string }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (!user?.id) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('User'),
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAdminByEmail({ email }: { email: string }) {
    try {
      const user = await this.prismaService.admin.findUnique({
        where: {
          email,
        },
      });

      if (!user?.id) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Admin'),
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById({ id }: { id: string }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });
      if (!user?.id) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('User'),
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByPhoneNumber({ phoneNumber }: { phoneNumber: string }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          phoneNumber,
        },
      });

      if (!user?.id) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAdminById({ id }: { id: string }) {
    try {
      const user = await this.prismaService.admin.findUnique({
        where: {
          id,
        },
      });

      if (!user?.id) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Admin'),
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getSubscription({ id }: { id: string }) {
    try {
      const subscription = await this.prismaService.quotation.findUnique({
        where: {
          id,
        },
        include: {
          quotationDetails: true,
          adminDetail: true,
        },
      });
      if (!subscription?.id) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Subscription'),
        );
      }

      return subscription;
    } catch (error) {
      throw error;
    }
  }

  async getCarById({ id }: { id: string }) {
    try {
      const carData = await this.prismaService.car.findUnique({
        where: {
          id,
        },
        include: {
          carGallery: true,
          products: true,
        },
      });
      if (!carData?.id) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Car'),
        );
      }

      return carData;
    } catch (error) {
      throw error;
    }
  }

  async checkCarDocuments({ carId }: { carId: string }) {
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

      const carProducts = await this.prismaService.carProductDocuments.findMany(
        {
          where: {
            carProduct: { carId, deleted: false },
          },
        },
      );

      if (!carProducts.length) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Car documents'),
        );
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

      if (!carImages.length) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Car Images'),
        );
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

      if (!carVideos.length) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Car Videos'),
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async checkBundleProducts(bundleProducts: BundlePayment) {
    try {
      const { carId, productIds } = bundleProducts;
      if (!productIds || productIds.length < 2) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom('A bundle must contain more than two products'),
        );
      }

      const bundleAlreadyExists = await this.prismaService.carProduct.findFirst(
        {
          where: {
            carId,
            deleted: false,
            bundledItems: {
              some: { productId: { in: productIds } },
              every: { productId: { in: productIds } },
            },
          },
        },
      );

      if (bundleAlreadyExists) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom(
            'A bundle with the specified products already exists',
          ),
        );
      }

      // Retrieve all specified products in a single query
      const products = await this.prismaService.carProduct.findMany({
        where: {
          id: { in: productIds },
          deleted: false,
          productType: ProductType.PRODUCT,
          carId,
        },
      });

      // Ensure each product ID has a corresponding CarProduct entry
      if (products.length !== productIds.length) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('car products'),
        );
      }
      return;
    } catch (error) {
      throw error;
    }
  }

  async checkProductForDelete(productIds: string[]) {
    try {
      for await (const productId of productIds) {
        const productDetail = await this.prismaService.carProduct.findUnique({
          where: {
            id: productId,
          },
        });
        if (productDetail?.deleted) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.notFound('Product'),
          );
        }
        const bundles = await this.prismaService.carProduct.findMany({
          where: {
            deleted: false,
            productType: ProductType.BUNDLE,
            bundledItems: {
              some: {
                productId,
              },
            },
          },
        });
        if (bundles?.length) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.custom(
              `Product is linked with ${bundles.map((bundle) => bundle.fileType).join(',')}`,
            ),
          );
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
