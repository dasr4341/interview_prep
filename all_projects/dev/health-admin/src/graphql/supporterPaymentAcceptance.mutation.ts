import { gql } from '@apollo/client';

export const supporterPaymentAcceptanceMutation = gql`
  mutation SupporterPaymentAcceptace($stripeSessionId: String!) {
    pretaaHealthSupporterPaymentAcceptace(stripeSessionId: $stripeSessionId) {
      paidPaymentBy
    }
  }
`;
