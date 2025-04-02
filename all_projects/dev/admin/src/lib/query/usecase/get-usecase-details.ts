import { gql } from '@apollo/client';

export const GetUseCaseDetailsQuery = gql`
  query GetUseCaseDetails(
    $where: UseCaseCollectionsWhereInput
    $orderBy: [UseCaseCollectionsOrderByWithRelationInput!]
  ) {
    pretaaGetUseCaseCollections(where: $where orderBy: $orderBy) {
      id
      name
      default
      useCasesOnCollections {
        id
        status
        useCaseId
        collectionId
        useCase {
          name
          displayName
          useCasesDataObjects {
            dataObject {
              displayName
            }
          }
        }
      }
    }
  }
`;
