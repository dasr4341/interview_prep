import { gql } from '@apollo/client';

export const GetEventCountsByTypeQuery = gql`
  query PretaaGetEventCountsByType(
    $dateRangeType: DateRangeTypes!,
    $companyId: String,
    $reporteeUserId: String,
    $companyType: GeneralCompaniesOptions
  ) {
    pretaaGetEventCountsByType(
      dateRangeType: $dateRangeType,
      companyId: $companyId,
      reporteeUserId: $reporteeUserId,
      companyType: $companyType
    ) {
      eventType
      count
    }
  }
`;
