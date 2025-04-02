/* eslint-disable max-len */
import { gql } from '@apollo/client';

export const updateDataObject = gql`
  mutation UpdateDataObject(
  $name: String!,
  $data: DataObjectCollectionOnDataObjectUpdateManyWithoutDataObjectCollectionsInput,
  $id: String!
) {
  pretaaUpdateDataObjectsCollection(
    name: $name,
    dataObjectCollectionOnDataObject: $data,
    id: $id
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
