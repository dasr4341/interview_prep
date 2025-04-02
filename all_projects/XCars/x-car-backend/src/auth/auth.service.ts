import { StatusCodes } from './../common/enum/status-codes.enum';
import { Injectable } from '@nestjs/common';
import { Token } from 'src/common/model/sign-in-response.model';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { DealerRegisterInput, UserRegisterInput } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Mode, Roles, UserStatus, User } from '@prisma/client';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { HelperService } from 'src/helper/helper.service';
import { Response } from 'src/common/model/response.model';
import { PhoneNotificationService } from 'src/phone-notification/phone-notification.service';
import { VerifyRegistrationWithPhoneNumber } from './model/verify-registration-with-phone-number.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly prismaService: PrismaService,
    private readonly helperService: HelperService,
    private readonly phoneNotificationService: PhoneNotificationService,
  ) {}

  async verifyToken() {
    try {
      return {
        message: 'Token verified',
        success: true,
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  }

  async getNewTokens({
    refreshToken,
  }: {
    refreshToken: string;
  }): Promise<Token> {
    try {
      const payload = await this.jwtTokenService.verifyRefreshToken({
        token: refreshToken,
      });

      const newPayload = { email: payload.email, sub: payload.sub };

      const newAccessToken =
        await this.jwtTokenService.generateAccessToken(newPayload);
      const newRefreshToken =
        await this.jwtTokenService.generateRefreshToken(newPayload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async registerWithPhoneNumberViaOtp(
    registerInput: DealerRegisterInput | UserRegisterInput,
  ): Promise<Response> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          phoneNumber: registerInput.phoneNumber,
        },
      });

      if (user?.role !== registerInput.role && user?.isPhoneNumberConfirmed) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom(
            `Phone number already registered as ${user.role}`,
          ),
        );
      }

      if (
        user?.id &&
        user?.isPhoneNumberConfirmed &&
        user.role === Roles.USER
      ) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.alreadyExists('Phone number'),
        );
      }

      if (
        user?.id &&
        user?.isPhoneNumberConfirmed &&
        user.role === Roles.DEALER
      ) {
        if (user.userStatus === UserStatus.PENDING) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.custom(
              'Your application under process, Our representative will contact you soon.',
            ),
          );
        } else {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.alreadyExists('Phone number'),
          );
        }
      }

      const otp = this.helperService.generateOTP(6);

      await this.prismaService.$transaction(async (tx) => {
        await this.prismaService.user.upsert({
          where: { phoneNumber: registerInput.phoneNumber },
          create: {
            ...registerInput,
          },
          update: {
            ...registerInput,
          },
        });

        await tx.otpVerification.upsert({
          where: {
            desc: registerInput.phoneNumber,
          },
          create: {
            otp,
            mode: Mode.PHONE_NUMBER,
            desc: registerInput.phoneNumber,
          },
          update: {
            otp,
            mode: Mode.PHONE_NUMBER,
            desc: registerInput.phoneNumber,
          },
        });
      });

      await this.phoneNotificationService.sendOtp({
        phoneNumber: registerInput.phoneNumber,
        otp,
      });

      return {
        message: `Otp sent successfully at ${registerInput.phoneNumber}.`,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async loginWithPhoneNumberOtp({
    phoneNumber,
    role,
  }: {
    phoneNumber: string;
    role: Roles;
  }): Promise<Response> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          phoneNumber,
        },
      });

      if (!user?.id || user?.role !== role) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('User'),
        );
      }

      if (
        user.userStatus === UserStatus.PENDING &&
        user.role === Roles.DEALER
      ) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom(
            'Your application under process, Our representative will contact you soon.',
          ),
        );
      }

      if (user.userStatus === UserStatus.DISABLED) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.disabled('User'),
        );
      }

      const otp = this.helperService.generateOTP(6);

      await this.prismaService.otpVerification.upsert({
        where: {
          desc: phoneNumber,
        },
        create: {
          otp,
          mode: Mode.PHONE_NUMBER,
          desc: phoneNumber,
        },
        update: {
          otp,
          mode: Mode.PHONE_NUMBER,
          desc: phoneNumber,
        },
      });

      await this.phoneNotificationService.sendOtp({
        phoneNumber,
        otp,
      });

      return {
        message: `Otp sent successfully at ${phoneNumber}.`,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyRegistrationWithPhoneOtp({
    phoneNumber,
    otp,
  }): Promise<VerifyRegistrationWithPhoneNumber> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          phoneNumber,
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
          desc: phoneNumber,
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

      let userData: User;

      await this.prismaService.$transaction(async (tx) => {
        userData = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            isPhoneNumberConfirmed: true,
            userStatus:
              user.role === Roles.USER
                ? UserStatus.ONBOARDED
                : UserStatus.PENDING,
          },
        });

        await tx.otpVerification.delete({
          where: {
            desc: phoneNumber,
          },
        });
      });

      const payload = { phoneNumber: user.phoneNumber, sub: user.id };
      const tokens = {
        accessToken: await this.jwtTokenService.generateAccessToken(payload),
        refreshToken: await this.jwtTokenService.generateRefreshToken(payload),
      };
      const responseObject =
        userData.role === Roles.DEALER
          ? { dealerId: userData.id }
          : { signInToken: tokens };

      return {
        ...responseObject,
        message: 'Phone Number verified successfully.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyLoginPhoneNumberOtp({
    phoneNumber,
    otp,
  }): Promise<VerifyRegistrationWithPhoneNumber> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      if (!user?.id) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('User'),
        );
      }

      if (
        user.role === Roles.DEALER &&
        user.userStatus === UserStatus.PENDING
      ) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notApproved(user.role),
        );
      }

      if (
        user.role === Roles.DEALER &&
        user.userStatus === UserStatus.DISABLED
      ) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.disabled(user.role),
        );
      }

      const findOtp = await this.prismaService.otpVerification.findUnique({
        where: {
          desc: phoneNumber,
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

      await this.prismaService.otpVerification.delete({
        where: {
          desc: phoneNumber,
        },
      });

      if (user.userStatus === UserStatus.APPROVED) {
        await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            userStatus: UserStatus.ONBOARDED,
          },
        });
      }

      const payload = { phoneNumber: user.phoneNumber, sub: user.id };
      const tokens = {
        accessToken: await this.jwtTokenService.generateAccessToken(payload),
        refreshToken: await this.jwtTokenService.generateRefreshToken(payload),
      };

      return {
        signInToken: tokens,
        message: 'Login successful!',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
}
