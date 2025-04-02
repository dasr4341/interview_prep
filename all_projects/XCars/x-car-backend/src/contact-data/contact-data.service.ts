import { Injectable } from '@nestjs/common';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactDataDTO } from './dto/contact-data.dto';
import { CarStatus, LeadType, User } from '@prisma/client';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { HelperService } from 'src/helper/helper.service';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import { CheckerService } from 'src/checker/checker.service';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import { getISTDateTimeString } from 'src/common/helper';

@Injectable()
export class ContactDataService {
  constructor(
    private prismaService: PrismaService,
    private emailNotificationService: EmailNotificationService,
    private checkService: CheckerService,
    private helperService: HelperService,
    private configService: ConfigService,
  ) {}

  async contactFormSubmit({
    user,
    formData,
  }: {
    user: User;
    formData: ContactDataDTO;
  }) {
    try {
      let lead = null;
      let findLead = null;

      const car = await this.checkService.getCarById({ id: formData.carId });

      if (car.carStatus !== CarStatus.APPROVED) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notApproved('Car'),
        );
      }

      await this.prismaService.$transaction(async (tx) => {
        if (formData.alternatePhone) {
          formData.alternatePhone = `${this.configService.get<string>('COUNTRY_CODE')}${formData.alternatePhone}`;
        }
        const createdContact = await tx.contactData.upsert({
          where: { userId_carId: { userId: user.id, carId: formData.carId } },
          create: {
            userId: user.id,
            carId: formData.carId,
            alternateEmail: formData.alternateEmail,
            alternatePhone: formData.alternatePhone,
            contactMessage: {
              create: {
                message: formData.message,
              },
            },
          },
          update: {
            alternateEmail: formData.alternateEmail,
            alternatePhone: formData.alternatePhone,
            contactMessage: {
              create: {
                message: formData.message,
              },
            },
          },
        });

        findLead = await tx.leads.findFirst({
          where: {
            carId: formData.carId,
            userId: user.id,
          },
        });

        if (findLead) {
          await tx.leads.update({
            where: {
              id: findLead.id,
            },
            data: {
              contactId: createdContact.id,
            },
          });
        } else {
          lead = await tx.leads.create({
            data: {
              leadType: LeadType.LEAD,
              carId: formData.carId,
              userId: user.id,
              contactId: createdContact.id,
            },
          });
        }
      });

      if (lead) {
        await this.helperService.autoAssignLeadToDealer({
          carId: formData.carId,
          leadId: lead.id,
        });
      }

      // notifying admin
      const emailTemplatePath = path.join(
        path.resolve(),
        'public',
        'templates',
        'contact.html',
      );
      const htmlTemplate = await fs.readFile(emailTemplatePath, 'utf8');
      await this.emailNotificationService.sendMail({
        recipientEmail: this.configService.get<string>('ADMIN_EMAIL'),
        emailTemplate: htmlTemplate,
        subject: 'Contact from User',
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`,
        message: formData.message ?? '',
        date: getISTDateTimeString(new Date()),
      });

      return { message: 'Form Submitted Successfully', success: true };
    } catch (error) {
      throw error;
    }
  }

  async getContactData({
    userId,
    pagination,
  }: {
    userId: string;
    pagination?: PaginationInput;
  }) {
    try {
      let offset = 0,
        take = 10;
      if (pagination) {
        offset = (pagination.page - 1) * pagination.limit;
        take = pagination.limit;
      }
      let whereParam = null;
      whereParam = {};

      if (userId) {
        whereParam = {
          userId,
        };
      }
      const allData = await this.prismaService.contactData.findMany({
        where: whereParam,
        include: {
          contactMessage: {
            select: { message: true, createdAt: true, updatedAt: true },
            orderBy: {
              updatedAt: 'desc',
            },
          },
          car: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip: offset,
        take,
      });

      const allDataCount = await this.prismaService.contactData.count({
        where: whereParam,
      });
      return {
        success: true,
        message: 'All contacts fetched',
        data: allData,
        pagination: pagination
          ? {
              maxPage: Math.ceil(allDataCount / pagination.limit),
              currentPage: pagination.page,
              total: allDataCount,
              limit: pagination.limit,
            }
          : null,
      };
    } catch (error) {
      throw error;
    }
  }
}
