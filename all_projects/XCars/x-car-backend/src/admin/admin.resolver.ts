import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignInResponse } from 'src/common/model/sign-in-response.model';
import { AdminLoginInput } from './dto/admin-login.dto';
import { AdminService } from './admin.service';
import { Response } from 'src/common/model/response.model';
import { Admin } from 'src/common/model/admin.model';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { AllowedRoles } from 'src/decorators/allowed-role.decorator';
import { Roles } from '@prisma/client';
import { GetUser } from 'src/decorators/get-user.decorator';
import { ForgetPasswordResponse } from 'src/common/model/forget-password.model';
import { UpdateAdminDetailsInput } from './dto/update-admin-details.dto';
import { QuotationInput } from './dto/raise-quotation.dto';
import { CheckerService } from '../checker/checker.service';
import { BundlePayment } from './dto/bundle-payment.dto';

@Resolver()
export class AdminResolver {
  constructor(
    private adminService: AdminService,
    private checkerService: CheckerService,
  ) {}

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => Admin, {
    description: 'Get admin details using this endpoint (protected route)',
  })
  async getAdminDetails(@GetUser() user: Admin): Promise<Admin> {
    return await this.checkerService.getAdminById({ id: user.id });
  }

  @Mutation(() => SignInResponse, {
    description: 'A admin user can login using this endpoint',
  })
  async adminLogin(@Args() adminLogin: AdminLoginInput) {
    return await this.adminService.adminLogin(adminLogin);
  }

  @Mutation(() => Response, {
    description: 'In case admin has forgot the password.',
  })
  async adminForgetPassword(@Args('email') email: string): Promise<Response> {
    return await this.adminService.forgetPassword({ email });
  }

  @Mutation(() => ForgetPasswordResponse)
  async adminForgetPasswordEmailVerification(@Args('token') token: string) {
    return await this.adminService.forgetPasswordEmailVerification({
      forgetPasswordToken: token,
    });
  }

  @Mutation(() => Response)
  async adminSetForgetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ) {
    return await this.adminService.setNewPassword({
      token,
      newPassword,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async adminResetPassword(
    @GetUser() user: Admin,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ) {
    return await this.adminService.resetPassword({
      userId: user.id,
      newPassword,
      oldPassword,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Admin)
  async updateAdminDetails(
    @GetUser() user: Admin,
    @Args() adminDetails: UpdateAdminDetailsInput,
  ): Promise<Admin> {
    return await this.adminService.updateAdminDetails({
      ...adminDetails,
      userId: user.id,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async raiseQuotation(
    @GetUser() user: Admin,
    @Args() raiseQuotation: QuotationInput,
  ): Promise<Response> {
    return await this.adminService.raiseQuotation({
      ...raiseQuotation,
      adminId: user.id,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async makeBundle(@Args() makeBundle: BundlePayment) {
    return await this.adminService.makeBundle(makeBundle);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Mutation(() => Response)
  async deleteBundle(@Args('bundleId') bundleId: string) {
    return await this.adminService.deleteBundle({ bundleId });
  }
}
