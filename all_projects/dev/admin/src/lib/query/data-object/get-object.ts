import { gql } from '@apollo/client';

export const getObjectQuery = gql`
  query GetObject(
    $where: DataObjectCollectionsWhereInput
    $orderBy: [DataObjectCollectionOnDataObjectOrderByWithRelationInput!]
  ) {
    pretaaListDataObjectCollections(where: $where) {
      id
      name
      default
      isAllAccess
      dataObjectCollectionOnDataObject(orderBy: $orderBy) {
        status
        dataObject {
          id
          name
          displayName
          dataSource {
            name
            sourceType
          }
          useCasesDataObjectsClient {
            useCase {
              displayName
            }
          }
        }
        dataObjectCollectionId
      }
    }
  }
`;
