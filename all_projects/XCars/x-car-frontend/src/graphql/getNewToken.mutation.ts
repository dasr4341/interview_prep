import { graphql } from '@/generated/gql';

export const GET_ACCESS_TOKEN = graphql(`
  mutation GetNewTokensQuery($refreshToken: String!) {
    getNewTokens(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`);
