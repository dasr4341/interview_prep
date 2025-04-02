import { gql } from '@apollo/client';

export const getCompanyFilterOptionsQuery = gql`
  query pretaaGetCompaniesFilterOptions($pretaaGetCompaniesFilterOptionsSearchPhrase2: String) {
    pretaaGetCompaniesFilterOptions(searchPhrase: $pretaaGetCompaniesFilterOptionsSearchPhrase2) {
      GENERAL
      COMPANIES {
        id
        name
      }
      TEAM_MEMBERS {
        id
        firstName
        lastName
      }
    }
  }
`;
