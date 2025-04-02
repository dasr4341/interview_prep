import { graphql } from '@/generated/gql';

export const GET_STATS_COUNTS = graphql(`
  query GetStatsCountsDashboard {
    getStatsCountsDashboard {
      message
      success
      data {
        leads {
          totalLeads
          totalHotAssignedLeads
          totalColdAssignedLeads
          totalHotUnassignedLeads
          totalColdUnassignedLeads
          inPast7DaysLeads
        }
        cars {
          totalCars
          totalPendingCars
          totalSoldCars
          totalDisabledCars
          totalApprovedCars
          inPast7DaysSoldCars
          inPast7DaysApprovedCars
        }
        totalDealers
        totalCustomers
        totalVisitors
        inPast7DaysVisitors
      }
    }
  }
`);

export const GET_DASHBOARD_REPORT_BY_DATES = graphql(`
  query GetReportByDateRangeDashboard(
    $type: DashboardReportType!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    getReportByDateRangeDashboard(
      type: $type
      startDate: $startDate
      endDate: $endDate
    ) {
      message
      success
      data {
        key
        count
      }
    }
  }
`);
