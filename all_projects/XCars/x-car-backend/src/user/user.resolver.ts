import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Response } from 'src/common/model/response.model';
import { UpdateDealerInput, UpdateUserInput } from './dto/update-user.dto';
import { EmailOtpInput } from './dto/email-otp.dto';
import { VerifyEmailOtpInput } from './dto/verify-email-otp.dto';
import { AllUsers, User, UserDetails } from 'src/common/model/user.model';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { AllowedRoles } from 'src/decorators/allowed-role.decorator';
import { Roles } from '@prisma/client';
import { UpdateDealerStatusInput } from './dto/update-dealer-status.dto';
import { AWSService } from 'src/AWS/aws.service';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { GetUser } from 'src/decorators/get-user.decorator';
import {
  GetDealerQuotation,
  ModifiedGetDealerQuotations,
} from './model/dealer-quotation.model';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import { CheckerService } from 'src/checker/checker.service';
import { JwtOptionalGuard } from 'src/guard/jwt-optional.guard';
import CustomError from 'src/global-filters/custom-error-filter';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import ErrorMessage from 'src/global-filters/error-message-filter';
import {
  UserPaymentLog,
  UserPaymentLogs,
} from 'src/common/model/all-payment-log-dealer.model';
import { UpdateDealer } from './model/update-dealer.model';
import { DeleteDocType } from 'src/common/enum/delete-doc-type.enum';
import { UpdateEndUser } from './model/update-user.model';
import { UploadUserDocument } from './dto/upload-file-user.dto';
import { UserAnalytics } from './dto/user-analytics.dto';
import { UserAnalyticsReport } from './model/user-analytics.model';
import { UserInvoiceFilterInput } from './dto/user-payment-invoice-filter.dto';
import { PhoneNumberOtpInput } from './dto/phone-number-otp.dto';
import { HelperService } from 'src/helper/helper.service';
import { UserFilterInput } from 'src/dealer/dto/view-dealer.dto';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly awsService: AWSService,
    private readonly checkerService: CheckerService,
    private readonly helperService: HelperService,
  ) {}

  @UseGuards(JwtGuard)
  @Query(() => User)
  async getUserDetails(
    @GetUser() user: User,
    @Args('userId', { nullable: true }) userId?: string,
  ) {
    let id = userId;
    if (user.role !== Roles.ADMIN) {
      id = user.id;
    }
    const profileImage = user.profileImage
      ? this.awsService.getGalleryFileUrl(user.profileImage)
      : null;
    const userData = await this.checkerService.getUserById({ id });
    return { ...userData, profileImage };
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => AllUsers)
  async getAllCustomers(
    @Args() pagination: PaginationInput,
    @Args('filter', { type: () => [UserFilterInput], nullable: true })
    filter?: UserFilterInput[],
  ): Promise<AllUsers> {
    return this.userService.getAllCustomers(pagination, filter);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => UserDetails)
  async getCustomersDetails(
    @Args('userId', { type: () => String, nullable: false })
    userId: string,
  ): Promise<UserDetails> {
    return this.userService.getCustomersDetails(userId);
  }

  @Query(() => Response)
  checkPhoneNumber(@Args() phoneNumberInput: PhoneNumberOtpInput) {
    return this.helperService.validatePhoneNumber({
      phoneNumber: this.helperService.validateAndFormatPhoneNumber(
        phoneNumberInput.phoneNumber,
      ),
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async updateDealerStatus(
    @Args() updateDealerStatusInput: UpdateDealerStatusInput,
  ) {
    return this.userService.updateDealerStatus(updateDealerStatusInput);
  }

  @UseGuards(JwtOptionalGuard)
  @Mutation(() => UpdateDealer)
  updateDealer(
    @GetUser() user: User,
    @Args() input: UpdateDealerInput,
  ): Promise<UpdateDealer> {
    return this.userService.updateDealer({
      input,
      user,
    });
  }

  @UseGuards(JwtGuard)
  @Mutation(() => Response)
  sendEmailOtp(
    @GetUser() user: User,
    @Args() emailOtpInput: EmailOtpInput,
  ): Promise<Response> {
    return this.userService.sendEmailOtp({ ...emailOtpInput, userId: user.id });
  }

  @UseGuards(JwtGuard)
  @Mutation(() => Response)
  verifyEmailOtp(
    @GetUser() user: User,
    @Args() verifyEmailOtpInput: VerifyEmailOtpInput,
  ): Promise<Response> {
    return this.userService.verifyEmail({
      ...verifyEmailOtpInput,
      userId: user.id,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async uploadUserDocument(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @Args() input: UploadUserDocument,
  ): Promise<Response> {
    const keys: { path: string; fileName: string }[] = [];

    for await (const file of files) {
      const fileName = await file.filename;
      const key = await this.awsService.uploadFile({
        file: await file,
        uploadCategory: input.uploadCategory,
        id: input.dealerId,
      });
      keys.push({ path: key, fileName });
    }
    return await this.userService.addDealerDocument({
      dealerId: input.dealerId,
      keys,
      fileType: input.fileType,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async deleteProduct(
    @Args('productIds', { type: () => [String] }) productIds: string[],
  ) {
    await this.checkerService.checkProductForDelete(productIds);
    return await this.userService.deleteProduct(productIds);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async deleteGalleryOrDealerDocument(
    @Args('documentId') documentId: string,
    @Args('docType', { type: () => DeleteDocType }) docType: DeleteDocType,
  ) {
    if (docType === DeleteDocType.DEALER) {
      return await this.userService.deleteDealerDocument(documentId);
    }
    return await this.userService.deleteGalleryItem(documentId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER, Roles.ADMIN)
  @Query(() => ModifiedGetDealerQuotations)
  async getDealerQuotations(
    @GetUser() user: User,
    @Args() pagination: PaginationInput,
    @Args('carId', { nullable: true }) carId?: string,
    @Args('dealerId', { nullable: true }) dealerId?: string,
  ): Promise<ModifiedGetDealerQuotations> {
    let userId = user.id;
    if (user.role === Roles.ADMIN) {
      if (!dealerId) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Dealer Id'),
        );
      }
      userId = dealerId;
    }
    return await this.userService.getDealerQuotations({
      userId,
      carId,
      pagination,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.DEALER, Roles.ADMIN)
  @Query(() => GetDealerQuotation)
  async getQuotationDetail(
    @GetUser() user: User,
    @Args('quotationId', { nullable: true }) quotationId?: string,
    @Args('dealerId', { nullable: true }) dealerId?: string,
  ): Promise<GetDealerQuotation> {
    let userId = user.id;
    if (user.role === Roles.ADMIN) {
      if (!dealerId) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('Dealer Id'),
        );
      }
      userId = dealerId;
    }
    return await this.userService.getDealerQuotation({
      dealerId: userId,
      quotationId,
    });
  }

  @UseGuards(JwtGuard)
  @Query(() => UserPaymentLogs)
  async getPaymentHistoryList(
    @GetUser() user: User,
    @Args() pagination: PaginationInput,
    @Args('userId', { type: () => String, nullable: true })
    userId?: string,
    @Args('filter', { type: () => [UserInvoiceFilterInput], nullable: true })
    filter?: UserInvoiceFilterInput[],
  ): Promise<UserPaymentLogs> {
    const response = await this.userService.getPaymentHistoryList({
      userId: user.role !== Roles.ADMIN ? user.id : userId,
      pagination,
      filter,
      role: user.role,
    });

    return response;
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.USER, Roles.ADMIN)
  @Query(() => UserPaymentLog)
  async getPaymentHistory(
    @GetUser() user: User,
    @Args('paymentId', { type: () => String })
    paymentId?: string,
  ): Promise<UserPaymentLog> {
    const response = await this.userService.getPaymentHistoryList({
      userId: user.id,
      paymentId,
      role: user.role,
    });

    return {
      data: response.data[0],
      message: 'User payment log',
      success: response.success,
    };
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.USER)
  @Mutation(() => UpdateEndUser)
  async updateEndUserDetail(
    @Args() updatedInput: UpdateUserInput,
    @GetUser() user: User,
  ): Promise<UpdateEndUser> {
    return this.userService.updateEndUserDetail({ user, updatedInput });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.USER, Roles.ADMIN)
  @Query(() => UserAnalyticsReport)
  async userAnalytics(
    @GetUser() user: User,
    @Args() input: UserAnalytics,
    @Args('userId', { nullable: true }) userId?: string,
  ) {
    let id = user.id;

    if (user.role === Roles.ADMIN) {
      if (!userId) {
        throw new CustomError(
          StatusCodes.NOT_FOUND,
          ErrorMessage.notFound('User Id'),
        );
      }
      id = userId;
    }

    return await this.userService.userAnalytics({
      userId: id,
      input,
    });
  }

  @UseGuards(JwtGuard)
  @Mutation(() => Response)
  async deleteUserProfileImage(@GetUser() user: User) {
    return await this.userService.deleteProfileImage({ user });
  }
}
