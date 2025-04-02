import { Injectable } from '@nestjs/common';
import { CarStatus, LeadsStatus, LeadType, Roles } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportData, ReportDataModel } from './model/report.model';
import { GetStatsCountResponseModel } from './model/stats-count.model';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async carListingReport({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<ReportDataModel> {
    try {
      const allCars = await this.prismaService.car.findMany({
        where: {
          carStatus: { in: [CarStatus.PENDING, CarStatus.APPROVED] },
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: { createdAt: true },
        orderBy: {
          createdAt: 'asc',
        },
      });

      const response = await this.dataGroupByByDates({
        startDate,
        endDate,
        data: allCars.map((car) => car.createdAt),
      });
      return {
        success: true,
        message: 'Cart Report',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  async visitorsReport({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<ReportDataModel> {
    try {
      const uniqueVisitors = await this.prismaService.userAnalytics.groupBy({
        where: {
          updatedAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        by: ['ipAddress'],
        _max: {
          updatedAt: true,
        },
      });
      uniqueVisitors.sort(
        (a, b) => a._max.updatedAt.getTime() - b._max.updatedAt.getTime(),
      );
      const visitors = uniqueVisitors.map(
        (eachVisitor) => eachVisitor._max.updatedAt,
      );
      const response = await this.dataGroupByByDates({
        startDate,
        endDate,
        data: visitors,
      });
      return {
        success: true,
        message: 'Visitors Report',
        data: response,
      };
    } catch (error) {
      throw error;
    }
  }

  async leadsReport({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<ReportDataModel> {
    try {
      const allLeads = await this.prismaService.leads.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      const response = await this.dataGroupByByDates({
        startDate,
        endDate,
        data: allLeads.map((lead) => lead.createdAt),
      });

      return {
        data: response,
        success: true,
        message: 'Leads Report',
      };
    } catch (error) {
      throw error;
    }
  }

  async soldCarsReport({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {
    try {
      const allSoldCars = await this.prismaService.car.findMany({
        where: {
          carStatus: CarStatus.SOLD,
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'asc',
        },
      });
      const response = await this.dataGroupByByDates({
        startDate,
        endDate,
        data: allSoldCars.map((car) => car.updatedAt),
      });
      return {
        data: response,
        success: true,
        message: 'Sold Cars Report',
      };
    } catch (error) {
      throw error;
    }
  }

  async getStatsCounts(): Promise<GetStatsCountResponseModel> {
    try {
      const data = {
        leads: {
          totalLeads: this.getCountHelper('leads', {}),
          totalHotAssignedLeads: this.getCountHelper('leads', {
            leadType: LeadType.HOT_LEAD,
            leadStatus: LeadsStatus.ASSIGNED,
          }),
          totalColdAssignedLeads: this.getCountHelper('leads', {
            leadType: LeadType.LEAD,
            leadStatus: LeadsStatus.ASSIGNED,
          }),
          totalHotUnassignedLeads: this.getCountHelper('leads', {
            leadType: LeadType.HOT_LEAD,
            leadStatus: LeadsStatus.UNASSIGNED,
          }),
          totalColdUnassignedLeads: this.getCountHelper('leads', {
            leadType: LeadType.LEAD,
            leadStatus: LeadsStatus.UNASSIGNED,
          }),
          inPast7DaysLeads: this.getCountHelper('leads', {
            createdAt: {
              gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          }),
        },
        cars: {
          totalCars: this.getCountHelper('car', {}),
          totalPendingCars: this.getCountHelper('car', {
            carStatus: CarStatus.PENDING,
          }),
          totalSoldCars: this.getCountHelper('car', {
            carStatus: CarStatus.SOLD,
          }),
          inPast7DaysSoldCars: this.getCountHelper('car', {
            carStatus: CarStatus.SOLD,
            updatedAt: {
              gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          }),
          totalDisabledCars: this.getCountHelper('car', {
            carStatus: CarStatus.DISABLED,
          }),
          totalApprovedCars: this.getCountHelper('car', {
            carStatus: CarStatus.APPROVED,
          }),
          inPast7DaysApprovedCars: this.getCountHelper('car', {
            carStatus: CarStatus.APPROVED,
            updatedAt: {
              gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          }),
        },
        users: {
          totalDealers: this.getCountHelper('user', {
            role: Roles.DEALER,
          }),
          totalCustomers: this.getCountHelper('user', {
            role: Roles.USER,
          }),
          totalVisitors: this.prismaService.userAnalytics
            .groupBy({
              by: ['ipAddress'],
              _count: {
                ipAddress: true,
              },
            })
            .then((res) => res.length),
          inPast7DaysVisitors: this.prismaService.userAnalytics
            .groupBy({
              by: ['ipAddress'],
              _count: {
                ipAddress: true,
              },
              where: {
                createdAt: {
                  gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
                },
              },
            })
            .then((res) => res.length),
        },
      };
      const [leads, cars, users] = await Promise.all([
        Promise.all(
          Object.entries(data.leads).map(async ([key, query]) => ({
            key,
            value: await query,
          })),
        ),
        Promise.all(
          Object.entries(data.cars).map(async ([key, query]) => ({
            key,
            value: await query,
          })),
        ),
        Promise.all(
          Object.entries(data.users).map(async ([key, query]) => ({
            key,
            value: await query,
          })),
        ),
      ]);
      const formatData = <T>(entries: { key: string; value: number }[]): T =>
        entries.reduce(
          (acc, { key, value }) => ({ ...acc, [key as keyof T]: value }),
          {} as T,
        );

      return {
        success: true,
        message: 'Stats fetched successfully',
        data: {
          ...formatData(users),
          leads: formatData(leads),
          cars: formatData(cars),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // HELPERS ----------------------------------------
  async getCountHelper(
    table: string,
    where: Record<string, any>,
  ): Promise<number> {
    return this.prismaService[table].count({ where });
  }

  async dataGroupByByDates({
    startDate,
    endDate,
    data,
  }: {
    startDate: Date;
    endDate: Date;
    data: Date[];
  }): Promise<ReportData[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const differenceInMin = (end.getTime() - start.getTime()) / (1000 * 60);

    // if difference of dates is less than 60 minutes [minute vs count]
    if (differenceInMin <= 60) {
      const reducedData = data.reduce(
        (acc: { [key: string]: number }, curr) => {
          const key = curr.toISOString().substring(11, 16);
          if (acc[key]) {
            acc[key]++;
          } else {
            acc[key] = 1;
          }
          return acc;
        },
        {},
      );
      return Object.entries(reducedData).map(([key, value]) => ({
        key,
        count: value,
      }));
    }

    const differenceInHour =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    // if difference of dates is between 60 minutes and 24 hours [hour vs count]
    if (differenceInMin > 60 && differenceInHour <= 24) {
      const reducedData = data.reduce(
        (acc: { [key: string]: number }, curr) => {
          const key = curr.toISOString().substring(11, 16);
          if (acc[key]) {
            acc[key]++;
          } else {
            acc[key] = 1;
          }
          return acc;
        },
        {},
      );
      return Object.entries(reducedData).map(([key, value]) => ({
        key,
        count: value,
      }));
    }

    const differenceInDay =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    // if difference of dates is between 24 hours and 30 days [day vs count]
    if (
      differenceInMin > 60 &&
      differenceInHour > 24 &&
      differenceInDay <= 30
    ) {
      const reducedData = data.reduce(
        (acc: { [key: string]: number }, curr) => {
          const month = Number(curr.toISOString().substring(5, 7)) - 1;
          const date = curr.toISOString().substring(8, 10);
          const key = `${date} ${months[month]}`;
          if (acc[key]) {
            acc[key]++;
          } else {
            acc[key] = 1;
          }
          return acc;
        },
        {},
      );
      return Object.entries(reducedData).map(([key, value]) => ({
        key,
        count: value,
      }));
    }

    const differenceInMonth =
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
    // if difference of dates is greater than 30 days and less than 12 months [month vs count]
    if (differenceInDay > 30 && differenceInMonth <= 12) {
      const reducedData = data.reduce(
        (acc: { [key: string]: number }, curr) => {
          const year = curr.toISOString().substring(0, 4);
          const month = Number(curr.toISOString().substring(5, 7)) - 1;

          const fullKey = `${months[month]} ${year}`;
          if (acc[fullKey]) {
            acc[fullKey]++;
          } else {
            acc[fullKey] = 1;
          }
          return acc;
        },
        {},
      );
      return Object.entries(reducedData).map(([key, value]) => ({
        key,
        count: value,
      }));
    }

    // else return years wise [year vs count]
    const reducedData = data.reduce((acc: { [key: string]: number }, curr) => {
      const year = curr.toISOString().substring(0, 4);
      if (acc[year]) {
        acc[year]++;
      } else {
        acc[year] = 1;
      }
      return acc;
    }, {});
    return Object.entries(reducedData).map(([key, value]) => ({
      key,
      count: value,
    }));
  }
}
