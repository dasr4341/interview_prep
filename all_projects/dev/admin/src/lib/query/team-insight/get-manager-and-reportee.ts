import { gql } from '@apollo/client';

export const getManagerAndReporteeQuery = gql`
  query PretaaGetManagerAndReporteeData(
    $skip: Int
    $take: Int
    $reporteeUserId: String
    $dateRangeType: DateRangeTypes!
  ) {
    pretaaGetManagerAndReporteeData(
      skip: $skip
      take: $take
      dateRangeType: $dateRangeType
      reporteeUserId: $reporteeUserId
    ) {
      referencesCount
      launchesCount
      userCompanyRatingsCount
      reportees {
        reportee {
          id
          name
          _count {
            userReportee
          }
        }
        totalRevenue
        stageWiseRevenue {
         label
         revenueAmount
       }
        companyCount
        companies {
         id
         name
        }
      }
    }
  }
`;
