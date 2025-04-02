import { Injectable } from '@nestjs/common';
import { PaginationInput } from 'src/common/dto/pagination.dto';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { DealerLeadsResponse } from './model/dealer-leads.model';
import { HelperService } from 'src/helper/helper.service';
import { DocumentType, LeadsStatus, QuotationStatus } from '@prisma/client';
import { FilterService } from 'src/filter/filter.service';
import { DealerLeadFilterInput, LeadFilterInput } from './dto/lead-filter.dto';
import { getColumnNames } from 'src/common/helper';
import { AWSService } from 'src/AWS/aws.service';

@Injectable()
export class LeadsService {
  constructor(
    private prismaService: PrismaService,
    private helperService: HelperService,
    private readonly filterService: FilterService,
    private readonly awsService: AWSService,
  ) {}

  async getDealerLeads({
    dealerId,
    leadId,
    pagination,
    filter,
  }: {
    dealerId: string;
    leadId?: string;
    pagination: PaginationInput;
    filter?: DealerLeadFilterInput[];
  }): Promise<DealerLeadsResponse> {
    try {
      let whereParam = null;

      whereParam = {
        dealerId,
      };

      if (leadId) {
        whereParam = {
          ...whereParam,
          lead: {
            ...whereParam?.lead,
            id: leadId,
          },
        };
      }

      if (filter?.length) {
        const carFilter = [];
        const dealerLead = [];
        const leadFilterData = filter.filter((data) => {
          if (getColumnNames({ tableName: 'Car' })[data.column]) {
            carFilter.push(data);
          } else if (
            getColumnNames({ tableName: 'DealerLeads' })[data.column]
          ) {
            dealerLead.push(data);
          } else if (getColumnNames({ tableName: 'Leads' })[data.column]) {
            return data;
          }
        });
        whereParam = {
          ...whereParam,
          ...this.filterService.getFilteredData({ fields: dealerLead }),
          lead: {
            ...whereParam?.lead,
            ...this.filterService.getFilteredData({ fields: leadFilterData }),
            car: {
              ...this.filterService.getFilteredData({ fields: carFilter }),
            },
          },
        };
      }

      const offset = (pagination.page - 1) * pagination.limit;
      const leads = await this.prismaService.dealerLeads.findMany({
        where: whereParam,
        include: {
          lead: {
            include: {
              contact: {
                include: {
                  contactMessage: {
                    select: { message: true, createdAt: true, updatedAt: true },
                    orderBy: {
                      createdAt: 'desc',
                    },
                  },
                },
              },
              car: {
                include: {
                  user: true,
                },
              },
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: pagination.limit,
      });

      const updatedLeads = await Promise.all(
        leads.map(async (lead) => {
          const matchingProducts =
            await this.prismaService.productsPurchased.findMany({
              where: {
                carId: lead.lead.carId,
                userId: lead.lead.userId,
              },
              include: {
                carProduct: {
                  select: {
                    id: true,
                    fileType: true,
                    productType: true,
                  },
                },
              },
            });
          return {
            ...lead,
            lead: {
              ...lead.lead,
              purchasedProducts: matchingProducts,
            },
          };
        }),
      );

      const totalLeadsCount = await this.prismaService.dealerLeads.count({
        where: whereParam,
      });

      return {
        leads: updatedLeads,
        pagination: {
          maxPage: Math.ceil(totalLeadsCount / pagination.limit),
          currentPage: pagination.page,
          total: totalLeadsCount,
          limit: pagination.limit,
        },
        message: 'Dealer leads.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminLeads({
    leadId,
    pagination,
    filter,
  }: {
    leadId?: string;
    pagination: PaginationInput;
    filter?: LeadFilterInput[];
  }) {
    try {
      let whereParam = {};

      if (leadId) {
        whereParam = {
          id: leadId,
        };
      }
      if (filter?.length) {
        const carFilter = [];
        const userFilter = [];
        const leadFilterData = filter.filter((data) => {
          if (getColumnNames({ tableName: 'Car' })[data.column]) {
            carFilter.push(data);
          } else if (getColumnNames({ tableName: 'User' })[data.column]) {
            userFilter.push(data);
          } else if (getColumnNames({ tableName: 'Leads' })[data.column]) {
            return data;
          }
        });

        whereParam = {
          ...whereParam,
          ...this.filterService.getFilteredData({ fields: leadFilterData }),
          car: {
            ...this.filterService.getFilteredData({ fields: carFilter }),
          },
          user: {
            ...this.filterService.getFilteredData({ fields: userFilter }),
          },
        };
      }

      const offset = (pagination.page - 1) * pagination.limit;

      const allLeads = await this.prismaService.leads.findMany({
        where: whereParam,
        include: {
          contact: {
            include: {
              contactMessage: {
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
          },
          user: true,
          car: {
            include: {
              quotation: {
                where: {
                  quotationStatus: QuotationStatus.ACTIVE,
                },
              },
              user: true,
              carGallery: {
                where: { thumbnail: true },
                include: { carGalleryDocuments: true },
              },
            },
          },
          dealerLeads: {
            include: { dealerAnalytics: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: pagination.limit,
      });

      const modifiedData = [];
      for (const lead of allLeads) {
        const activeQuotation = lead?.car?.quotation?.length ? true : false;
        const callCount = lead?.dealerLeads?.dealerAnalytics?.length || 0;
        let signedThumbnails = [];
        if (lead.car.carGallery?.length) {
          signedThumbnails = this.awsService.signedGalleryDocuments(
            lead.car.carGallery[0].carGalleryDocuments,
          );
          lead.car.carGallery[0].carGalleryDocuments = signedThumbnails;
        }
        modifiedData.push({ ...lead, activeQuotation, callCount });
      }

      const totalLeadsCount = await this.prismaService.leads.count({
        where: whereParam,
      });

      return {
        success: true,
        message: 'All leads fetched.',
        data: modifiedData,
        pagination: {
          maxPage: Math.ceil(totalLeadsCount / pagination.limit),
          currentPage: pagination.page,
          total: totalLeadsCount,
          limit: pagination.limit,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async assignLeads({ leads }: { leads: string[] }) {
    try {
      const notAssignLeads = [];
      for await (const leadId of leads) {
        const leadDetails = await this.prismaService.leads.findUnique({
          where: {
            id: leadId,
          },
          include: { user: true },
        });
        if (leadDetails.leadStatus === LeadsStatus.UNASSIGNED) {
          const status = await this.helperService.autoAssignLeadToDealer({
            carId: leadDetails.carId,
            leadId,
          });

          notAssignLeads.push({ ...leadDetails, assigned: status });
        }
      }

      return {
        data: notAssignLeads,
        message: 'Leads assigned successfully',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateNote({
    dealerId,
    leadId,
    note,
  }: {
    dealerId: string;
    leadId: string;
    note: string;
  }) {
    try {
      const isLeadExist = await this.prismaService.dealerLeads.findUnique({
        where: { leadId, dealerId },
      });

      if (!isLeadExist) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Lead'),
        );
      }

      await this.prismaService.dealerLeads.update({
        where: { leadId },
        data: {
          note,
        },
      });
      return {
        success: true,
        message: 'Lead notes updated successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateLeadSeenStatus({
    dealerId,
    isSeenAll,
    leadIds,
  }: {
    dealerId: string;
    isSeenAll: boolean;
    leadIds: string[];
  }) {
    try {
      if (isSeenAll) {
        await this.prismaService.dealerLeads.updateMany({
          where: { dealerId },
          data: { seen: true },
        });
      } else {
        await this.prismaService.dealerLeads.updateMany({
          where: { leadId: { in: leadIds } },
          data: { seen: true },
        });
      }
      return {
        success: true,
        message: 'All selected lead has been seen.',
      };
    } catch (error) {
      throw error;
    }
  }
}
