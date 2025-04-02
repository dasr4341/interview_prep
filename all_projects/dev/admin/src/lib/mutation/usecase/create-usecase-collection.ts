import { gql } from '@apollo/client';

export const CreateUseCaseCollectionMutation = gql`
  mutation CreateUseCaseCollection(
    $name: String!
    $useCasesOnCollections: 
    UseCasesOnCollectionsCreateNestedManyWithoutCollectionInput
  ) {
    pretaaCreateUseCaseCollection(
      name: $name
      useCasesOnCollections: $useCasesOnCollections
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
