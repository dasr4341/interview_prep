import { gql } from '@apollo/client';

export const SearchReportManagerQuery = gql`
  query GetSearchReportManager($reporteeUserId: String!, $searchPhrase: String) {
    pretaaGetManagerMembers(
      reporteeUserId: $reporteeUserId
      searchPhrase: $searchPhrase
    ) {
      id
      firstName
      lastName
    }
  }
`;
