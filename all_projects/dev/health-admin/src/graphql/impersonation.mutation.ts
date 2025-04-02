import { gql } from '@apollo/client';

export const impersonationToSuperAdmin = gql`
  mutation PretaaAdminImpersonation($userId: String!, $refreshToken: String!) {
    pretaaHealthAdminImpersonation(id: $userId, token: $refreshToken)
  }
`;

export const impersonateToCounselor = gql`
  mutation ImpersonateFacilityUser($pretaaHealthImpersonationId: String!, $token: String!) {
    pretaaHealthImpersonation(id: $pretaaHealthImpersonationId, token: $token)
  }
`;

export const impersonateBack = gql`
  mutation StopImpersonation {
    pretaaHealthBackImpersonation
  }
`;

export const impersonationToFacilityAdmin = gql`
  mutation Impersonation($uid: String!, $refreshToken: String!) {
    pretaaHealthImpersonation(id: $uid, token: $refreshToken)
  }
`;
