import { gql } from '@apollo/client';

export const getTicketsDataQuery = gql`
   query GetCompanyTicketsCount($filterRange: PretaaDateRangeParams!, $companyIds: [String!]!) {
    pretaaGetCompanyTicketsCount(filterRange: $filterRange, companyIds: $companyIds) {
      openTicket
      closeTicket
      sparklineOpen {
        date
        count
      }
      sparklineClose {
        date
        count
      }
    }
  }
`;
