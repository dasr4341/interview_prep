import { Injectable } from '@nestjs/common';
import {
  CarStatus,
  LeadsStatus,
  Prisma,
  QuotationStatus,
  Roles,
} from '@prisma/client';
import { AWSService } from 'src/AWS/aws.service';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { GetDealerDetails } from './model/dealer-details.model';
import { HelperService } from 'src/helper/helper.service';
import { DealerAnalyticsResponse } from './model/dealer-analytics.model';
import { FilterService } from 'src/filter/filter.service';
import { DealerAnalyticsDto } from './dto/dealer-analytics.dto';
import { UserFilterInput } from './dto/view-dealer.dto';

@Injectable()
export class DealerService {
  constructor(
    private prismaService: PrismaService,
    private awsService: AWSService,
    private helperService: HelperService,
    private readonly filterService: FilterService,
  ) {}

  async viewAllDealers(
    dealerFilter: UserFilterInput[],
    pagination: PaginationInput,
  ) {
    try {
      const offset = (pagination.page - 1) * pagination.limit;
      let whereParams: Prisma.UserWhereInput = { role: Roles.DEALER };

      if (dealerFilter?.length) {
        const filteredWhereClause = this.filterService.getFilteredData({
          fields: dealerFilter,
        });
        whereParams = {
          ...whereParams,
          ...filteredWhereClause,
        };
      }

      const allDealers = await this.prismaService.user.findMany({
        where: whereParams,
        include: {
          documents: true,
          cars: { include: { quotation: true } },
        },
        skip: offset,
        take: pagination.limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      const data = [];
      for (const dealer of allDealers) {
        const { documents } = dealer;
        const signedUrls = {};

        const totalCars = dealer.cars.length;
        let totalActiveQuotation = 0;
        let totalPendingQuotation = 0;
        dealer.cars.forEach((car) => {
          car.quotation.forEach((data) => {
            if (
              data.quotationStatus === QuotationStatus.ACTIVE &&
              car.carStatus === CarStatus.APPROVED
            ) {
              totalActiveQuotation++;
            } else if (data.quotationStatus === QuotationStatus.PENDING) {
              totalPendingQuotation++;
            }
          });
        });

        for (const data of documents) {
          const signedURL = this.awsService.getProductFileUrl(data.path);
          if (!signedUrls[data.fileType]) {
            signedUrls[data.fileType] = [];
          }
          signedUrls[data.fileType].push({
            ...data,
            path: signedURL,
          });
        }
        const modifiedData =
          this.helperService.convertUserDocuments(signedUrls);

        data.push({
          ...dealer,
          documents: modifiedData,
          totalCars,
          totalActiveQuotation,
          totalPendingQuotation,
        });
      }

      const allDealersCount = await this.prismaService.user.count({
        where: whereParams,
      });

      return {
        data,
        pagination: {
          maxPage: Math.ceil(allDealersCount / pagination.limit),
          currentPage: pagination.page,
          total: allDealersCount,
          limit: pagination.limit,
        },
        message: 'All dealers.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async viewDealer(dealerId: string): Promise<GetDealerDetails> {
    try {
      const dealerDetails = await this.prismaService.user.findUnique({
        where: { id: dealerId, role: Roles.DEALER },
        include: {
          documents: true,
        },
      });

      if (!dealerDetails?.id) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Dealer'),
        );
      }

      const { documents, ...dealerData } = dealerDetails;
      const signedUrls = {};

      for (const data of documents) {
        const signedURL = this.awsService.getProductFileUrl(data.path);
        if (!signedUrls[data.fileType]) {
          signedUrls[data.fileType] = [];
        }
        signedUrls[data.fileType].push({ ...data, path: signedURL });
      }
      const modifiedData = this.helperService.convertUserDocuments(signedUrls);

      return {
        data: { documents: modifiedData, ...dealerData },
        message: 'Dealer details.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getQuotationsInRange({
    quotationStatus,
    dealerId,
    quotation,
  }: {
    quotationStatus: QuotationStatus;
    dealerId: string;
    quotation: { start?: Date; end?: Date };
  }) {
    return await this.prismaService.quotation.findMany({
      where: {
        dealerId,
        quotationStatus: quotationStatus,
        AND: [
          quotation?.start ? { createdAt: { gte: quotation.start } } : {},
          quotation?.end ? { createdAt: { lte: quotation.end } } : {},
        ],
      },
    });
  }

  async getDealerAnalyticsReport({
    id,
    input,
  }: {
    id: string;
    input?: DealerAnalyticsDto;
  }): Promise<DealerAnalyticsResponse> {
    try {
      const { dealerId, lead, quotation } = input;

      const [
        totalCarsPosted,
        totalCarsApproved,
        totalCarsPending,
        totalCarsDisabled,
      ] = await Promise.all([
        this.prismaService.car.count({
          where: {
            userId: id || dealerId,
          },
        }),
        this.prismaService.car.count({
          where: {
            userId: id || dealerId,
            carStatus: CarStatus.APPROVED,
          },
        }),
        this.prismaService.car.count({
          where: {
            userId: id || dealerId,
            carStatus: CarStatus.PENDING,
          },
        }),
        this.prismaService.car.count({
          where: {
            userId: id || dealerId,
            carStatus: CarStatus.DISABLED,
          },
        }),
      ]);

      const cars = {
        totalCarsPosted,
        totalCarsApproved,
        totalCarsPending,
        totalCarsDisabled,
      };

      const [totalAssignedLeads, totalUnAssignedLeadsCount] = await Promise.all(
        [
          await this.prismaService.dealerLeads.findMany({
            where: {
              dealerId: dealerId || id,
              lead: { leadStatus: LeadsStatus.ASSIGNED },
            },
          }),
          await this.prismaService.leads.count({
            where: {
              car: {
                userId: dealerId || id,
              },
              leadStatus: LeadsStatus.UNASSIGNED,
            },
            orderBy: { createdAt: 'desc' },
          }),
        ],
      );
      const totalAssignedLeadsCount = totalAssignedLeads.length;
      const groupAssignedLeads =
        this.helperService.groupLeadsByYearAndMonth(totalAssignedLeads);

      const leads = {
        assignedLeads: groupAssignedLeads,
        totalAssignedLeadsCount,
        totalUnAssignedLeadsCount,
      };

      const [
        activeQuotations,
        pendingQuotations,
        cancelQuotations,
        paidQuotations,
        expiredQuotations,
      ] = await Promise.all([
        this.prismaService.quotation.count({
          where: {
            dealerId: dealerId || id,
            quotationStatus: QuotationStatus.ACTIVE,
          },
        }),
        this.prismaService.quotation.count({
          where: {
            dealerId: dealerId || id,
            quotationStatus: QuotationStatus.PENDING,
          },
        }),
        this.prismaService.quotation.count({
          where: {
            dealerId: dealerId || id,
            quotationStatus: QuotationStatus.CANCELLED,
          },
        }),
        this.prismaService.quotation.count({
          where: {
            dealerId: dealerId || id,
            quotationStatus: QuotationStatus.PAID,
          },
        }),
        this.prismaService.quotation.count({
          where: {
            dealerId: dealerId || id,
            quotationStatus: QuotationStatus.EXPIRED,
          },
        }),
      ]);
      const quotations = {
        activeQuotations,
        pendingQuotations,
        cancelQuotations,
        expiredQuotations,
        paidQuotations,
      };

      if (input?.lead) {
        const totalLeadsInRange = await this.prismaService.dealerLeads.findMany(
          {
            where: {
              dealerId: dealerId,
              AND: [
                lead?.start ? { createdAt: { gte: lead.start } } : {},
                lead?.end ? { createdAt: { lte: lead.end } } : {},
              ],
            },
            orderBy: {
              createdAt: 'asc', // 'desc' for newest first
            },
          },
        );
        leads['totalLeadsInRange'] = totalLeadsInRange;
      }

      if (input?.quotation) {
        const [
          totalActiveQuotationsInRange,
          totalPendingQuotationsInRange,
          totalCancelQuotationsInRange,
          totalPaidQuotationsInRange,
          totalExpireQuotationsInRange,
        ] = await Promise.all([
          this.getQuotationsInRange({
            quotationStatus: QuotationStatus.ACTIVE,
            dealerId,
            quotation,
          }),
          this.getQuotationsInRange({
            quotationStatus: QuotationStatus.PENDING,
            dealerId,
            quotation,
          }),
          this.getQuotationsInRange({
            quotationStatus: QuotationStatus.CANCELLED,
            dealerId,
            quotation,
          }),
          this.getQuotationsInRange({
            quotationStatus: QuotationStatus.PAID,
            dealerId,
            quotation,
          }),
          this.getQuotationsInRange({
            quotationStatus: QuotationStatus.EXPIRED,
            dealerId,
            quotation,
          }),
        ]);
        quotations['totalActiveQuotationsInRange'] =
          totalActiveQuotationsInRange;

        quotations['totalPendingQuotationsInRange'] =
          totalPendingQuotationsInRange;

        quotations['totalCancelQuotationsInRange'] =
          totalCancelQuotationsInRange;

        quotations['totalPaidQuotationsInRange'] = totalPaidQuotationsInRange;

        quotations['totalExpireQuotationsInRange'] =
          totalExpireQuotationsInRange;
      }

      const data = {
        cars,
        leads,
        quotations,
      };

      return { data, message: 'Dealer analytics report', success: true };
    } catch (error) {
      throw error;
    }
  }

  async storeDealerAnalyticsData({
    customerId,
    dealerId,
    dealerLeadId,
  }: {
    customerId: string;
    dealerId: string;
    dealerLeadId: string;
  }) {
    try {
      await this.prismaService.dealerAnalytics.create({
        data: {
          dealerLeadId,
          dealerId,
          customerId,
          action: 'called',
        },
      });

      return {
        message: 'Data stored',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async checkDealerApproveStatus({ dealerId }: { dealerId: string }) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: dealerId,
        },
        include: { documents: true },
      });

      if (user.documents.length <= 0) {
        throw new CustomError(
          StatusCodes.NOT_ACCEPTABLE,
          ErrorMessage.notFound('Documents'),
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}
