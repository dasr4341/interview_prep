import { Args, Query, Resolver } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { UseGuards } from '@nestjs/common';
import { ReportDataModel } from './model/report.model';
import { JwtGuard } from 'src/guard/jwt.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { AllowedRoles } from 'src/decorators/allowed-role.decorator';
import { Roles } from '@prisma/client';
import { DashboardReportType } from 'src/common/enum/dashboard-report.enum';
import { GetStatsCountResponseModel } from './model/stats-count.model';
import CustomError from 'src/global-filters/custom-error-filter';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import ErrorMessage from 'src/global-filters/error-message-filter';

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => ReportDataModel)
  async getReportByDateRangeDashboard(
    @Args('type', { type: () => DashboardReportType })
    type: DashboardReportType,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<ReportDataModel> {
    switch (type) {
      case DashboardReportType.CAR_LISTING:
        return await this.dashboardService.carListingReport({
          startDate,
          endDate,
        });
      case DashboardReportType.VISITORS:
        return await this.dashboardService.visitorsReport({
          startDate,
          endDate,
        });
      case DashboardReportType.SOLD_CARS:
        return await this.dashboardService.soldCarsReport({
          startDate,
          endDate,
        });
      case DashboardReportType.LEADS_LISTING:
        return await this.dashboardService.leadsReport({
          startDate,
          endDate,
        });
      default:
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.notFound('Report type'),
        );
    }
  }

  @UseGuards(JwtGuard, RoleGuard)
  @AllowedRoles(Roles.ADMIN)
  @Query(() => GetStatsCountResponseModel)
  async getStatsCountsDashboard(): Promise<GetStatsCountResponseModel> {
    return await this.dashboardService.getStatsCounts();
  }
}
