import { gql } from '@apollo/client';

export const GetLaunchesQuery = gql`
  query GetLaunches($skip: Int, $take: Int, $companyId: String, $eventId: String, $opportunityId: String) {
    pretaaGetLaunchActions(
      skip: $skip
      take: $take
      companyId: $companyId
      eventId: $eventId
      opportunityId: $opportunityId
    ) {
      id
      text
      subject
      customerId
      createdAt
    }
  }
`;
