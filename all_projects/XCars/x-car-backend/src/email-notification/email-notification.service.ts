import { Injectable } from '@nestjs/common';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import Handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { SesMailInputType } from './types/ses-mail-input-type';
import { SesMailType } from './types/ses-mail-type';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';

@Injectable()
export class EmailNotificationService {
  private sesClient: SESClient;

  constructor(private configService: ConfigService) {
    const SES_CONFIG = {
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
      region: this.configService.get<string>('AWS_REGION'),
    };

    this.sesClient = new SESClient(SES_CONFIG);

    this.loadPartials();
  }

  private loadPartials() {
    const partialsDir = path.join(
      process.cwd(),
      'public',
      'templates',
      'partials',
    );
    fs.readdirSync(partialsDir).forEach((file) => {
      const partialName = path.basename(file, '.html');
      const partialTemplate = fs.readFileSync(
        path.join(partialsDir, file),
        'utf8',
      );
      Handlebars.registerPartial(partialName, partialTemplate);
    });
  }

  async sendMail({
    recipientEmail,
    emailTemplate,
    subject,
    otp,
    url,
    name,
    message,
    date,
    email,
    phone,
    carInfo,
    price,
    carDetailsLink,
    invoiceLink,
    invoiceNumber,
    dealerName,
  }: SesMailInputType) {
    let messageBody = emailTemplate;

    const templateMail = Handlebars.compile(emailTemplate);
    messageBody = templateMail({
      otp,
      url,
      name,
      message,
      date,
      email,
      phone,
      carInfo,
      price,
      carDetailsLink,
      invoiceLink,
      invoiceNumber,
      dealerName,
    });

    const params: SesMailType = {
      Source: this.configService.get<string>('SENDER_EMAIL'),
      Destination: {
        ToAddresses: [recipientEmail],
      },
      ReplyToAddresses: [this.configService.get<string>('SENDER_EMAIL')],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: messageBody,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };

    try {
      const sendEmailCommand = new SendEmailCommand(params);
      const response = await this.sesClient.send(sendEmailCommand);
      console.log('send otp in email response ->', response);
      if (response.$metadata.httpStatusCode === 200) {
        return true;
      } else {
        throw new CustomError(
          StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE,
          ErrorMessage.failed('send email'),
        );
      }
    } catch (error) {
      console.error('Failed to send mail', error);
      throw new CustomError(
        StatusCodes.INSUFFICIENT_SPACE_ON_RESOURCE,
        ErrorMessage.failed('send email'),
      );
    }
  }
}
