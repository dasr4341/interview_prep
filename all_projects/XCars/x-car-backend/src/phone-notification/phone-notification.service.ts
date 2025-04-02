import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import ErrorMessage from 'src/global-filters/error-message-filter';
import CustomError from 'src/global-filters/custom-error-filter';

@Injectable()
export class PhoneNotificationService {
  private snsClient: SNSClient;

  constructor(private readonly configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  async sendOtp({ phoneNumber, otp }: { phoneNumber: string; otp: string }) {
    const input = {
      PhoneNumber: phoneNumber,
      Message: `Welcome to X-Cars! Use the following One-Time Password (OTP) to complete your login: ${otp}. This code is valid for a short time only. If you didn't request this, please ignore this message`,
      Subject: 'Your One-Time Password (OTP)',
    };

    try {
      //do not send otp for development purpose
      if (this.configService.get<string>('NODE_ENV') === 'dev') {
        return true;
      }
      const command = new PublishCommand(input);
      const response = await this.snsClient.send(command);
      console.log('send otp in phone response -> ', response);
      if (response.$metadata.httpStatusCode === 200) {
        return true;
      } else {
        throw new CustomError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          ErrorMessage.failed('send OTP'),
        );
      }
    } catch (error) {
      throw new CustomError(
        error.extensions?.code ?? StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessage.failed('send OTP'),
      );
    }
  }
}
