import { gql } from '@apollo/client';

export const dynamicGroupsName = gql`
  query GetDynamicGroups {
    pretaaHealthAllGroups
  }
`;