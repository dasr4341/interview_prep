import { gql } from '@apollo/client';
export const pageViewLog = gql`
  mutation PageViewLog($fields: JSON!) {
    pretaaLogPageView(fields: $fields)
  }
`;
