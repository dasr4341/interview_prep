import { gql } from '@apollo/client';

export const GetUserInheritedPermissionsQuery = gql`
  query GetUserInheritedPermissions(
    $userCase: UseCaseCollectionsWhereInput,  
    $dataObject: DataObjectCollectionsWhereInput
  ) {
    pretaaGetUseCaseCollections(where: $userCase) {
      id
      name
      default
    }
    pretaaListDataObjectCollections(where: $dataObject) {
      id
      name
      default
    }
  }
`;
