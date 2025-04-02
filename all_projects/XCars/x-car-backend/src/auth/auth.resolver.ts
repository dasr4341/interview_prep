import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Token } from 'src/common/model/sign-in-response.model';
import { Response } from 'src/common/model/response.model';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { DealerRegisterInput, UserRegisterInput } from './dto/register.dto';
import { CheckerService } from 'src/checker/checker.service';
import CustomError from 'src/global-filters/custom-error-filter';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { Roles, UserStatus } from '@prisma/client';
import { VerifyRegistrationWithPhoneNumber } from './model/verify-registration-with-phone-number.model';
import { VerifyPhoneNumberOtpInput } from './dto/verify-phone-number-otp.dto';
import { HelperService } from 'src/helper/helper.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private readonly checkerService: CheckerService,
    private readonly helperService: HelperService,
  ) {}

  @Mutation(() => Token)
  async getNewTokens(
    @Args('refreshToken') refreshToken: string,
  ): Promise<Token> {
    return await this.authService.getNewTokens({ refreshToken });
  }

  @UseGuards(JwtGuard)
  @Query(() => Response)
  async verifyToken(): Promise<Response> {
    return await this.authService.verifyToken();
  }

  @Mutation(() => Response)
  registerDealerWithPhoneNumberViaOtp(
    @Args() registerInput: DealerRegisterInput,
  ): Promise<Response> {
    return this.authService.registerWithPhoneNumberViaOtp({
      ...registerInput,
      phoneNumber: this.helperService.validateAndFormatPhoneNumber(
        registerInput.phoneNumber,
      ),
      role: Roles.DEALER,
    });
  }

  @Mutation(() => Response)
  async registerUser(
    @Args() registerInput: UserRegisterInput,
  ): Promise<Response> {
    registerInput = {
      ...registerInput,
      phoneNumber: this.helperService.validateAndFormatPhoneNumber(
        registerInput.phoneNumber,
      ),
    };

    return this.authService.registerWithPhoneNumberViaOtp({
      ...registerInput,
      role: Roles.USER,
    });
  }

  @Mutation(() => Response)
  async loginWithPhoneOtp(
    @Args('phoneNumber') phoneNumber: string,
  ): Promise<Response> {
    phoneNumber = this.helperService.validateAndFormatPhoneNumber(phoneNumber);
    const user = await this.checkerService.getUserByPhoneNumber({
      phoneNumber,
    });

    if (!user?.isPhoneNumberConfirmed) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        ErrorMessage.custom('User not registered!'),
      );
    }
    return this.authService.loginWithPhoneNumberOtp({
      phoneNumber,
      role: Roles.DEALER,
    });
  }

  @Mutation(() => Response)
  async customerLoginWithPhoneOtp(
    @Args('phoneNumber') phoneNumber: string,
  ): Promise<Response> {
    phoneNumber = this.helperService.validateAndFormatPhoneNumber(phoneNumber);
    const user = await this.checkerService.getUserByPhoneNumber({
      phoneNumber,
    });

    if (!user?.isPhoneNumberConfirmed) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        ErrorMessage.custom('User not registered!'),
      );
    }
    return this.authService.loginWithPhoneNumberOtp({
      phoneNumber,
      role: Roles.USER,
    });
  }

  @Mutation(() => VerifyRegistrationWithPhoneNumber)
  async verifyLoginPhoneOtp(
    @Args() verifyPhoneNumberOtpInput: VerifyPhoneNumberOtpInput,
  ): Promise<VerifyRegistrationWithPhoneNumber> {
    verifyPhoneNumberOtpInput = {
      ...verifyPhoneNumberOtpInput,
      phoneNumber: this.helperService.validateAndFormatPhoneNumber(
        verifyPhoneNumberOtpInput.phoneNumber,
      ),
    };

    const user = await this.checkerService.getUserByPhoneNumber(
      verifyPhoneNumberOtpInput,
    );

    if (user.userStatus === UserStatus.PENDING) {
      return this.authService.verifyRegistrationWithPhoneOtp(
        verifyPhoneNumberOtpInput,
      );
    }

    return this.authService.verifyLoginPhoneNumberOtp(
      verifyPhoneNumberOtpInput,
    );
  }
}
