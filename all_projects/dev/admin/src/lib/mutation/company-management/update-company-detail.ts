import { gql } from '@apollo/client';

export const UpdateCompanyListMutation = gql`
  mutation UpdateCompanyList(
    $listId: String!
    $updatedName: String
    $updatedListCompanies: ListCompanyUpdateManyWithoutListInput
    $groups: [String!]
  ) {
    pretaaUpdateList(id: $listId, name: $updatedName, listCompanies: $updatedListCompanies, groups: $groups) {
      id
      name
    }
  }
`;
