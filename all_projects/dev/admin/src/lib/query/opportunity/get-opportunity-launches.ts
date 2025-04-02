import { gql } from '@apollo/client';

export const GET_OPPORTUNITY_LAUNCHES_QUERY = gql`
  query PretaaGetOpportunityLaunches($opportunityId: String!, $take: Int, $skip: Int) {
    pretaaGetOpprtunityLaunches(opportunityId: $opportunityId, take: $take, skip: $skip) {
      id
      eventId
      messageTemplateId
      sendToAddress
      subject
      text
      delta
      customerId
      userId
      createdAt
    }
  }
`;
