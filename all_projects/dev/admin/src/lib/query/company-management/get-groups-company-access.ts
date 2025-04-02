import { gql } from '@apollo/client';

export const GetGroupsCompanyAccessQuery = gql`
  query GetGroupsCompanyAccess($companyId: String!) {
    pretaaGetAllGroupsOfCompanyAccess(companyId: $companyId) {
      id
      name
      _count {
        users
      }
      dataObjectCollections {
        isAllAccess
        name
      }
      useCaseCollections {
        name
      }
      lists {
        list {
          name
        }
      }
    }
  }
`;
