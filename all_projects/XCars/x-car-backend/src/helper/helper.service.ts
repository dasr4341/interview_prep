import { Injectable } from '@nestjs/common';
import { LeadsStatus, QuotationStatus } from '@prisma/client';
import { format, isAfter } from 'date-fns';
import { CheckerService } from 'src/checker/checker.service';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FileUpload } from 'graphql-upload';
import { ConfigService } from '@nestjs/config';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { CarRegistrationNumberInput } from '../car/dto/registration-number.dto';
import { PhoneNumberOtpInput } from 'src/user/dto/phone-number-otp.dto';
import { getISTDateTimeString } from 'src/common/helper';

@Injectable()
export class HelperService {
  private vimeoAccessToken: string;
  constructor(
    private checkerService: CheckerService,
    private prismaService: PrismaService,
    private readonly configService: ConfigService,
    private emailNotificationService: EmailNotificationService,
  ) {
    this.vimeoAccessToken = this.configService.get('VIMEO_ACCESS_TOKEN');
  }

  async validateCarRegistrationNumber(
    carRegistrationNumberInput: CarRegistrationNumberInput,
  ) {
    const getCar = await this.prismaService.car.findFirst({
      where: {
        registrationNumber: carRegistrationNumberInput.registrationNumber,
      },
    });

    if (getCar?.id) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.alreadyExists('Registration Number'),
      );
    }

    return {
      message: 'Valid registration number',
      success: true,
    };
  }

  async validatePhoneNumber(phoneNumberInput: PhoneNumberOtpInput) {
    const user = await this.prismaService.user.findFirst({
      where: {
        phoneNumber: phoneNumberInput.phoneNumber,
      },
    });

    if (user?.id) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.alreadyExists('Phone Number'),
      );
    }

    return {
      message: 'Valid phone number',
      success: true,
    };
  }

  getVideoVimeoId(embedUrl: string): string {
    const match = embedUrl.match(/video\/(\d+)(?=\?|$)/);
    return match ? match[1] : '';
  }

  generateOTP(length: number): string {
    // Ensures that length is at least 1
    if (length <= 0) {
      throw new Error('OTP length must be greater than 0');
    }

    // Calculate the minimum and maximum values for the given length
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    // Generate a random number in the range of min to max
    const otp = Math.floor(min + Math.random() * (max - min + 1));

    return otp.toString();
  }

  isSubset = (array1: number[], array2: number[]): boolean => {
    const set2 = new Set(array2);
    return array1.every((element) => set2.has(element));
  };

  checkExtension = (filename: string, allowedExtensions: string[]): boolean => {
    // Extract extension from filename
    const extension = filename
      .split(/\.(?=[^.]*$)/)
      .pop()
      ?.toLowerCase();

    if (!extension) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.invalid('file extension'),
      );
    }

    // Check if allowedExtensions includes '*' (accept any file type)
    if (allowedExtensions.includes('*')) {
      return true;
    }

    // Check if the extension is in the allowed extensions array
    if (allowedExtensions.includes(extension)) {
      return true;
    } else {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.invalid(`file extension ${extension}`),
      );
    }
  };

  async autoAssignLeadToDealer({
    carId,
    leadId,
  }: {
    carId: string;
    leadId: string;
  }) {
    try {
      const carDetails = await this.checkerService.getCarById({ id: carId });

      const dealerId = carDetails.userId;

      const carActiveQuotation = await this.prismaService.car.findUnique({
        where: {
          id: carId,
        },
        select: {
          quotation: {
            where: {
              quotationStatus: QuotationStatus.ACTIVE,
            },
            include: {
              quotationDetails: true,
            },
          },
        },
      });

      // Check if there is an active quotation and if it has quotation details
      if (!carActiveQuotation?.quotation[0]?.quotationDetails) {
        return false;
      }

      const currentDate = new Date();
      if (
        isAfter(
          currentDate,
          carActiveQuotation?.quotation[0]?.quotationDetails.expiryDate,
        )
      ) {
        await this.prismaService.quotation.update({
          where: { id: carActiveQuotation.quotation[0].id },
          data: { quotationStatus: QuotationStatus.EXPIRED },
        });
        return false;
      }

      if (
        carActiveQuotation?.quotation[0].quotationStatus ===
          QuotationStatus.ACTIVE &&
        carActiveQuotation?.quotation[0]?.quotationDetails.noOfLeadsLeft
      ) {
        this.prismaService.$transaction(async (tx) => {
          await tx.dealerLeads.create({
            data: {
              dealerId,
              leadId,
            },
          });
          await tx.leads.update({
            where: {
              id: leadId,
            },
            data: {
              leadStatus: LeadsStatus.ASSIGNED,
            },
          });

          if (
            carActiveQuotation?.quotation[0].quotationDetails.noOfLeadsLeft ===
            1
          ) {
            await tx.quotation.update({
              where: {
                id: carActiveQuotation?.quotation[0].id,
              },
              data: {
                quotationStatus: QuotationStatus.EXPIRED,
              },
            });

            await tx.quotationDetails.update({
              where: {
                quotationId: carActiveQuotation?.quotation[0].id,
              },
              data: {
                noOfLeadsLeft: 0,
              },
            });
          } else {
            await tx.quotationDetails.update({
              where: {
                quotationId: carActiveQuotation?.quotation[0].id,
              },
              data: {
                noOfLeadsLeft:
                  carActiveQuotation?.quotation[0].quotationDetails
                    .noOfLeadsLeft - 1,
              },
            });
          }
        });

        const dealerDetails = await this.prismaService.user.findUnique({
          where: { id: dealerId },
        });
        // { contact: { include: { user: true } } },
        const leadDetails = await this.prismaService.leads.findUnique({
          where: { id: leadId },
          include: {
            user: true,
            contact: {
              include: {
                user: true,
                contactMessage: { orderBy: { createdAt: 'desc' }, take: 1 },
              },
            },
          },
        });

        // notifying admin
        const emailTemplatePath = path.join(
          path.resolve(),
          'public',
          'templates',
          'notifyLeadAssign.html',
        );
        const htmlTemplate = await fs.readFile(emailTemplatePath, 'utf8');
        if (dealerDetails?.email) {
          await this.emailNotificationService.sendMail({
            dealerName: dealerDetails.firstName || 'Dealer',
            recipientEmail: dealerDetails.email,
            emailTemplate: htmlTemplate,
            subject: 'Assign lead',
            email: `${leadDetails?.user?.email ?? ''}`,
            phone: `${leadDetails?.user?.phoneNumber ?? ''}`,
            message: `${leadDetails.contact?.contactMessage?.[0]?.message ?? ''}`,
            carInfo: `${carDetails.launchYear}, ${carDetails.companyName}, ${carDetails.model} ${carDetails.variant}`,
            date: getISTDateTimeString(leadDetails.createdAt),
          });
        }

        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  getExpiryDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  async checkUserForLead({ userId, carId }: { userId: string; carId: string }) {
    try {
      const lead = await this.prismaService.leads.findFirst({
        where: {
          userId,
          carId,
        },
      });

      if (lead) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  modifyQuotationData = (userQuotations) => {
    let quotations = [];
    let data = [];
    for (const eachQuotation of userQuotations) {
      if (eachQuotation.quotationStatus === QuotationStatus.CANCELLED) {
        quotations.push(eachQuotation);
      } else {
        quotations.push(eachQuotation);
        data.push({
          key: quotations[0].carId,
          quotations: quotations.reverse(),
        });
        quotations = [];
      }
    }
    if (quotations.length) {
      data.push({
        key: quotations[0].carId,
        quotations: quotations.reverse(),
      });
    }

    data = data.reverse();

    return data;
  };

  groupLeadsByYearAndMonth = (leads: any[]) => {
    const leadData = leads.reduce(
      (acc, lead) => {
        const year = lead.createdAt.getFullYear();
        const month = format(lead.createdAt, 'MMMM'); // Get month name as a string

        // Find or create the year entry in the accumulator
        let yearEntry = acc.find((entry) => entry.year === year);
        if (!yearEntry) {
          yearEntry = { year, data: [] };
          acc.push(yearEntry);
        }

        // Find or create the month entry within the year entry
        let monthEntry = yearEntry.data.find((entry) => entry.month === month);
        if (!monthEntry) {
          monthEntry = { month, data: [] };
          yearEntry.data.push(monthEntry);
        }

        // Push the lead into the month’s data array
        monthEntry.data.push(lead);

        return acc;
      },
      [] as Array<{
        year: number;
        data: Array<{ month: string; data: any[]; totalMonthlyLeads: number }>;
      }>,
    );

    return leadData.map((yearlyData) => {
      const monthlyData = yearlyData.data.map((monthlyData) => {
        return { ...monthlyData, totalMonthlyLeads: monthlyData.data.length };
      });
      return { ...yearlyData, data: monthlyData };
    });
  };

  async uploadVimeoVideo({
    file,
  }: {
    file: FileUpload;
  }): Promise<{ path: string; id: string }> {
    try {
      if (!file) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Video'),
        );
      }

      const { createReadStream } = await file;
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        createReadStream()
          .on('data', (chunk: Uint8Array) => chunks.push(chunk))
          .on('end', () => resolve(Buffer.concat(chunks)))
          .on('error', reject);
      });
      const fileSize = await new Promise<number>((resolve, reject) => {
        let size = 0;
        createReadStream()
          .on('data', (chunk: Uint8Array) => (size += chunk.length))
          .on('end', () => resolve(size))
          .on('error', reject);
      });
      const response = await axios.post(
        'https://api.vimeo.com/me/videos',
        {
          upload: {
            approach: 'tus',
            size: `${fileSize}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.vimeoAccessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
          },
        },
      );

      const uploadLink: string = response.data?.upload?.upload_link;
      const patchResponse = await axios.patch(uploadLink, buffer, {
        headers: {
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': '0',
          'Tus-Resumable': '1.0.0',
        },
      });

      if (patchResponse.status === 204 && response?.data?.player_embed_url) {
        return {
          path: response.data.player_embed_url,
          id: this.getVideoVimeoId(response.data.player_embed_url),
        };
      }
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.failed('upload video'),
      );
    } catch (error) {
      throw error;
    }
  }

  async uploadVimeoVideoThumbnail({
    videoVimeoId,
    file,
  }: {
    videoVimeoId: string;
    file: FileUpload;
  }): Promise<string> {
    try {
      const thumbnailResponse = await axios.post(
        `https://api.vimeo.com/videos/${videoVimeoId}/pictures`,
        { active: true },
        {
          headers: {
            Authorization: `Bearer ${this.vimeoAccessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.vimeo.*+json;version=3.4',
          },
        },
      );

      const thumbnailUploadLink = thumbnailResponse.data.link;
      const { createReadStream } = file;
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        createReadStream()
          .on('data', (chunk: Uint8Array) => chunks.push(chunk))
          .on('end', () => resolve(Buffer.concat(chunks)))
          .on('error', reject);
      });
      const thumbnailPutResponse = await axios.put(
        thumbnailUploadLink,
        buffer,
        {
          headers: {
            'Content-Type': 'application/offset+octet-stream',
            'Tus-Resumable': '1.0.0',
            'Upload-Offset': '0',
          },
        },
      );

      if (
        thumbnailPutResponse.status === 200 &&
        thumbnailResponse?.data?.sizes
      ) {
        const allLinks = thumbnailResponse.data.sizes;
        return allLinks[allLinks.length - 1].link;
      }
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.failed('upload thumbnail'),
      );
    } catch (error) {
      throw error;
    }
  }

  convertUserDocuments(input) {
    return Object.keys(input).map((fileType) => {
      const documents = input[fileType];
      return {
        userId: documents[0]?.userId,
        fileType: fileType,
        documentType: documents[0]?.documentType,
        docs: documents.map((doc) => ({
          id: doc.id,
          fileName: doc?.fileName,
          thumbnail: doc?.thumbnail ?? null,
          path: doc?.path,
          createdAt: doc?.createdAt,
          updatedAt: doc?.updatedAt,
        })),
      };
    });
  }

  validateAndFormatPhoneNumber(phone: string): string | null {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone, 'IN');
      if (phoneNumber && phoneNumber.isValid()) {
        if (phoneNumber.country === 'IN') {
          return phoneNumber.formatInternational().replace(/\s+/g, '');
        } else {
          return phoneNumber
            .formatInternational()
            .replace(/^\+\d+/, '+91')
            .replace(/\s+/g, '');
        }
      }
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.invalid('phone number'),
      );
    } catch (error) {
      throw error;
    }
  }
}
