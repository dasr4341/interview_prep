import { gql } from '@apollo/client';

export const createGroupQuery = gql`
  query GetUseCaseCollectionsAndDataObjects(
    $useCaseWhere: UseCaseCollectionsWhereInput
    $dataObjectWhere: DataObjectCollectionsWhereInput
    $listsWhere: ListWhereInput,
    $groupId: String
  ) {
    pretaaGetUseCaseCollections(where: $useCaseWhere) {
      id
      name
      default
    }
    pretaaListDataObjectCollections(where: $dataObjectWhere) {
      id
      name
      default
      isAllAccess
    }

    pretaaGetLists(where: $listsWhere, groupId: $groupId) {
      id
      name
      _count {
        listCompanies
      }
    }
  }
`;
