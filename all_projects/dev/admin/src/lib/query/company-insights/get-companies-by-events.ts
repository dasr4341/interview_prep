import { gql } from '@apollo/client';

export const GetCompaniesByEventsQuery = gql`
  query PretaaGetCompaniesByEvents(
    $skip: Int
    $take: Int
    $dateRangeType: DateRangeTypes!
    $companyId: String
    $reporteeUserId: String
    $companyType: GeneralCompaniesOptions
  ) {
    pretaaGetCompaniesByEvents(
      skip: $skip
      take: $take
      dateRangeType: $dateRangeType
      companyId: $companyId
      reporteeUserId: $reporteeUserId
      companyType: $companyType
    ) {
      id
      name
    }
  }
`;
