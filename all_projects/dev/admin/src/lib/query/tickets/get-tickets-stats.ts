import { gql } from '@apollo/client';

export const GetTicketStatsQuery = gql`
  query GetTicketStats(
    $filterRange: PretaaDateRangeParams!
    $companyIds: [String!]!
  ) {
    pretaaGetCompanyTicketStats(
      filterRange: $filterRange
      companyIds: $companyIds
    ) {
      fromDate
      toDate
      startingOpenTickets
      newOpenedTickets
      totalClosedTickets
      avgDaysOpen
      overallDaysOpen
      newTicketsAvgDaysOpen
      newTicketsOverallDaysOpen
      totalEndOpenTickets
    }
  }
`;
