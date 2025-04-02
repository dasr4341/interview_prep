import gql from 'graphql-tag';

export const ListDataObject = gql`
  query ListDataObjectCollections(
    $where: DataObjectCollectionsWhereInput
    $orderBy: [DataObjectCollectionsOrderByWithRelationInput!]
  ) {
    pretaaListDataObjectCollections(where: $where, orderBy: $orderBy) {
      id
      name
      default
      isAllAccess
    }
  }
`;
