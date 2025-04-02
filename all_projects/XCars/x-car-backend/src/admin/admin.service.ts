import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ProductType, QuotationStatus, Roles } from '@prisma/client';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignInResponse } from 'src/common/model/sign-in-response.model';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { CheckerService } from 'src/checker/checker.service';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Response } from 'src/common/model/response.model';
import { Admin } from 'src/common/model/admin.model';
import { ForgetPasswordResponse } from 'src/common/model/forget-password.model';
import { UpdateAdminDetailsInput } from './dto/update-admin-details.dto';
import { QuotationInput } from './dto/raise-quotation.dto';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { BundlePayment } from './dto/bundle-payment.dto';

@Injectable()
export class AdminService {
  constructor(
    private emailNotificationService: EmailNotificationService,
    private prismaService: PrismaService,
    private jwtTokenService: JwtTokenService,
    private checkerService: CheckerService,
    private configService: ConfigService,
  ) {}

  async updateAdminDetails(
    adminDetails: UpdateAdminDetailsInput,
  ): Promise<Admin> {
    try {
      const admin = await this.prismaService.admin.update({
        where: {
          id: adminDetails.userId,
        },
        data: {
          firstName: adminDetails.firstName,
          lastName: adminDetails.lastName,
        },
      });

      return admin;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword({
    userId,
    newPassword,
    oldPassword,
  }: {
    userId: string;
    newPassword: string;
    oldPassword: string;
  }) {
    try {
      const user = await this.checkerService.getAdminById({ id: userId });
      if (oldPassword === newPassword) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.canNotSame('Old Password', 'New Password'),
        );
      }

      if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.invalid('password'),
        );
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(newPassword, salt);
      await this.prismaService.admin.update({
        where: {
          id: userId,
        },
        data: {
          password: hashPassword,
        },
      });

      return {
        message: 'Password reset successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async setNewPassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }): Promise<Response> {
    try {
      const decoded = await this.jwtTokenService.verifyForgetPasswordToken({
        token,
      });

      const userId = decoded?.sub;

      const getToken = await this.prismaService.validTokens.findUnique({
        where: {
          userId,
          token,
        },
      });

      if (!getToken?.id) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.expired('link'),
        );
      }

      const user = await this.checkerService.getAdminById({ id: userId });
      if (await bcrypt.compare(newPassword, user.password)) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.canNotSame('Old Password', 'New Password'),
        );
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(newPassword, salt);

      await this.prismaService.$transaction(async (tx) => {
        await tx.admin.update({
          where: {
            id: userId,
          },
          data: {
            password: hashPassword,
          },
        });

        await tx.validTokens.delete({
          where: {
            userId,
          },
        });
      });

      return {
        message: 'Password reset successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async adminLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<SignInResponse> {
    try {
      const user = await this.checkerService.getAdminByEmail({ email });
      if (user && user.role !== Roles.ADMIN) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Admin'),
        );
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (user.email === email && isPasswordCorrect) {
        const payload = { email: user.email, sub: user.id };
        const tokens = {
          accessToken: await this.jwtTokenService.generateAccessToken(payload),
          refreshToken:
            await this.jwtTokenService.generateRefreshToken(payload),
        };

        return {
          signInToken: tokens,
          message: 'Login successful',
          success: true,
        };
      }

      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.invalid('email or password'),
      );
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword({ email }: { email: string }): Promise<Response> {
    try {
      const user = await this.checkerService.getAdminByEmail({ email });

      const forgetPasswordToken =
        await this.jwtTokenService.generateForgetPasswordToken({
          sub: user.id,
        });

      await this.prismaService.validTokens.upsert({
        where: {
          userId: user.id,
        },
        create: {
          token: forgetPasswordToken,
          userId: user.id,
        },
        update: {
          token: forgetPasswordToken,
          userId: user.id,
        },
      });

      const emailTemplatePath = path.join(
        path.resolve(),
        'public',
        'templates',
        'forgetPassword.html',
      );
      const htmlTemplate = await fs.readFile(emailTemplatePath, {
        encoding: 'utf8',
      });

      await this.emailNotificationService.sendMail({
        recipientEmail: email,
        emailTemplate: htmlTemplate,
        subject: 'Welcome to x-cars! Your reset password link',
        name: `${user.firstName} ${user.lastName ?? ''}`,
        url: `${this.configService.get<string>('FRONTEND_URL')}/reset-password/${forgetPasswordToken}`,
      });

      return {
        message: 'Forget password email sent successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async forgetPasswordEmailVerification({
    forgetPasswordToken,
  }: {
    forgetPasswordToken: string;
  }): Promise<ForgetPasswordResponse> {
    try {
      const verifyForgetPasswordToken = await this.checkerService.validateToken(
        {
          token: forgetPasswordToken,
        },
      );

      const payload = await this.jwtTokenService.verifyForgetPasswordToken({
        token: verifyForgetPasswordToken.token,
      });

      const user = await this.checkerService.getAdminById({ id: payload.sub });

      const newPayload = { email: user.email, sub: user.id };
      const token =
        await this.jwtTokenService.generateForgetPasswordToken(newPayload);

      await this.prismaService.validTokens.update({
        where: {
          userId: user.id,
        },
        data: {
          token,
        },
      });

      return {
        token,
        message: 'Forget password token verified successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async raiseQuotation(raiseQuotation: QuotationInput): Promise<Response> {
    try {
      await this.checkerService.checkCarDocuments({
        carId: raiseQuotation.carId,
      });

      const carData = await this.checkerService.getCarById({
        id: raiseQuotation.carId,
      });

      const activeQuotation = await this.prismaService.quotation.findFirst({
        where: {
          carId: raiseQuotation.carId,
          quotationStatus: QuotationStatus.ACTIVE,
        },
        include: { quotationDetails: true },
      });

      if (activeQuotation?.id) {
        const diff =
          activeQuotation.quotationDetails.expiryDate.getTime() -
          new Date().getTime();

        if (diff <= 0) {
          await this.prismaService.quotation.update({
            where: {
              id: activeQuotation.id,
            },
            data: {
              quotationStatus: QuotationStatus.EXPIRED,
            },
          });
        } else {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.custom('Car already has active quotation'),
          );
        }
      }

      await this.prismaService.$transaction(async (tx) => {
        await tx.quotation.updateMany({
          where: {
            carId: raiseQuotation.carId,
            quotationStatus: QuotationStatus.PENDING,
          },
          data: {
            quotationStatus: QuotationStatus.CANCELLED,
          },
        });

        const createdQuotation = await tx.quotation.create({
          data: {
            adminId: raiseQuotation.adminId,
            dealerId: carData.userId,
            carId: raiseQuotation.carId,
            quotationStatus: QuotationStatus.PENDING,
          },
        });

        await tx.quotationDetails.create({
          data: {
            noOfLeads: raiseQuotation.noOfLeads,
            noOfLeadsLeft: raiseQuotation.noOfLeads,
            validityDays: raiseQuotation.validityDays,
            amount: raiseQuotation.amount,
            quotationId: createdQuotation.id,
            startDate: new Date(),
            expiryDate: new Date(
              new Date().setDate(
                new Date().getDate() + raiseQuotation.validityDays,
              ),
            ),
          },
        });
      });

      return {
        message: 'Quotation raised successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async makeBundle(bundleInput: BundlePayment) {
    try {
      const { carId, productIds, name, amount, discountedAmount } = bundleInput;
      // Ensure the car exists
      await this.checkerService.getCarById({ id: carId });

      // Validate that products are selected
      if (!productIds.length) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom('Please select products to create a bundle'),
        );
      }

      await this.checkerService.checkBundleProducts(bundleInput);

      await this.prismaService.$transaction(async (prisma) => {
        // Step 1: Create the main CarProduct entry for the bundle
        const bundle = await prisma.carProduct.create({
          data: {
            amount,
            discountedAmount: discountedAmount ?? amount,
            carId,
            fileType: name,
            productType: ProductType.BUNDLE,
          },
        });

        // Step 2: Create BundleItems entries to link products to the bundle
        const bundleItems = productIds.map((productId) => ({
          bundleId: bundle.id,
          productId,
        }));

        await prisma.bundleItems.createMany({
          data: bundleItems,
        });

        return { bundle, bundleItems }; // Return both bundle and items for further processing or logging if needed
      });

      return {
        message: 'Bundle created successfully',
        success: true,
      };
    } catch (error) {
      // Log or handle the error as needed
      console.error('Error creating bundle:', error);
      throw error;
    }
  }

  async deleteBundle({ bundleId }: { bundleId: string }) {
    try {
      const bundle = await this.prismaService.carProduct.findUnique({
        where: {
          id: bundleId,
        },
      });

      if (!bundle?.id) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Bundle'),
        );
      }

      await this.prismaService.carProduct.update({
        where: {
          id: bundleId,
        },
        data: {
          deleted: true,
        },
      });

      return { message: 'Bundle deleted successfully', success: true };
    } catch (error) {
      throw error;
    }
  }
}
