import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContactDataService } from './contact-data.service';
import { Response } from 'src/common/model/response.model';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles, User } from '@prisma/client';
import { AllowedRoles } from 'src/decorators/allowed-role.decorator';
import { ContactDataDTO } from './dto/contact-data.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { GetContactsData } from './model/get-contacts.model';
import { JwtOptionalGuard } from 'src/guard/jwt-optional.guard';
import { AuthService } from 'src/auth/auth.service';
import { CheckerService } from 'src/checker/checker.service';
import { HelperService } from 'src/helper/helper.service';
import CustomError from 'src/global-filters/custom-error-filter';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { ContactFormRegisterInput } from './dto/user-register.dto';
import { PaginationInput } from 'src/common/dto/pagination.dto';

@Resolver()
export class ContactDataResolver {
  constructor(
    private readonly contactDataService: ContactDataService,
    private readonly authService: AuthService,
    private readonly checkerService: CheckerService,
    private readonly helperService: HelperService,
  ) {}

  @UseGuards(JwtOptionalGuard)
  @Mutation(() => Response)
  async contactFormSubmit(
    @GetUser() user: User,
    @Args('formData') formData: ContactDataDTO,
    @Args({
      name: 'registerInput',
      type: () => ContactFormRegisterInput,
      nullable: true,
    })
    registerInput?: ContactFormRegisterInput,
  ) {
    if (!user?.id && !registerInput?.phoneNumber) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        ErrorMessage.notFound('User'),
      );
    }

    if (!user?.id) {
      registerInput = {
        ...registerInput,
        phoneNumber: this.helperService.validateAndFormatPhoneNumber(
          registerInput.phoneNumber,
        ),
      };
      const checkForExistingUser =
        await this.checkerService.getUserByPhoneNumber({
          phoneNumber: registerInput.phoneNumber,
        });
      if (!checkForExistingUser?.id) {
        await this.authService.registerWithPhoneNumberViaOtp({
          ...registerInput,
          phoneNumber: registerInput.phoneNumber,
          role: Roles.USER,
        });
        user = await this.checkerService.getUserByPhoneNumber({
          phoneNumber: registerInput.phoneNumber,
        });
      } else {
        await this.authService.loginWithPhoneNumberOtp({
          phoneNumber: registerInput.phoneNumber,
          role: Roles.USER,
        });
        user = checkForExistingUser;
      }
    }
    return this.contactDataService.contactFormSubmit({
      user,
      formData,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.USER)
  @Query(() => GetContactsData)
  async getContactData(
    @GetUser() user: User,
    @Args() pagination: PaginationInput,
  ) {
    return this.contactDataService.getContactData({
      userId: user.id,
      pagination,
    });
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => GetContactsData)
  async getContactDataAdmin(
    @Args('userId', { nullable: true }) userId: string,
    @Args() pagination: PaginationInput,
  ) {
    return this.contactDataService.getContactData({
      userId,
      pagination,
    });
  }
}
