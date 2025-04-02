import { gql } from '@apollo/client';

export const stopImpersonation = gql`
  mutation StopImpersonation {
    pretaaStopImpersonation {
      loginToken
      refreshToken
    }
  }
`;
