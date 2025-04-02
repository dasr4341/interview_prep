import { gql } from '@apollo/client';

export const regenerateToken = gql`
  mutation RegenerateToken($refreshToken: String!) {
    pretaaHealthRegenerateRefreshTokens(refreshToken: $refreshToken)
  }
`;

export const regenerateOwnerToken = gql`
  mutation RegenerateOwnerToken($refreshToken: String!) {
    pretaaHealthAdminRegenerateTokens(refreshToken: $refreshToken)
  }
`;
