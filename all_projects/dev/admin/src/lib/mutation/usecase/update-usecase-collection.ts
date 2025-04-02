import { gql } from '@apollo/client';

export const UpdateUseCaseCollectionMutation = gql`
  mutation UpdateUseCaseCollection(
    $name: String!
    $id: String!
    $useCasesOnCollectionsUpdate: 
    UseCasesOnCollectionsUpdateManyWithoutCollectionInput
  ) {
    pretaaUpdateUseCaseCollection(
      name: $name
      id: $id
      useCasesOnCollections: $useCasesOnCollectionsUpdate
    ) {
      id
      name
      default
      useCasesOnCollections {
        id
        useCaseId
        status
        collectionId
      }
    }
  }
`;
