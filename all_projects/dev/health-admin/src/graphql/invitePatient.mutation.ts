import { gql } from '@apollo/client';

export const invitePatientMutation = gql`
  mutation InvitePatients($userIds: [String!]!) {
    pretaaHealthInvitePatients(userIds: $userIds)
  }
`;
