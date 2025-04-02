import { gql } from '@apollo/client';

export const CreateCompanyListMutation = gql`
  mutation CreateCompanyList(
    $listCompanies: ListCompanyCreateNestedManyWithoutListInput!
    $name: String!
    $groups: GroupListCreateNestedManyWithoutListInput
  ) {
    pretaaCreateList(listCompanies: $listCompanies, name: $name, groups: $groups) {
      id
      customerId
      createdAt
      name
    }
  }
`;
