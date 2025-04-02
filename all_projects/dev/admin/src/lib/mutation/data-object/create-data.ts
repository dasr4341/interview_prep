/* eslint-disable max-len */
import { gql } from '@apollo/client';

export const createDataObject = gql`
  mutation CreateDataObject(
    $name: String!
    $collectionObject: DataObjectCollectionOnDataObjectCreateNestedManyWithoutDataObjectCollectionsInput
  ) {
    pretaaCreateDataObjectCollection(
      name: $name
      dataObjectCollectionOnDataObject: $collectionObject
    ) {
      id
      name
      default
      isAllAccess
      dataObjectCollectionOnDataObject {
        status
        dataObject {
          id
          dataSource {
            name
            sourceType
          }
        }
      }
    }
  }
`;
