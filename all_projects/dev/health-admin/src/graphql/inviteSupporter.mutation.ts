import { gql } from '@apollo/client';

export const inviteSupporter = gql`
  mutation PretaaHealthSubmitSupporter($email: String!, $patientId: String!) {
    pretaaHealthSubmitSupporter(email: $email, patientId: $patientId)
  }
`;
