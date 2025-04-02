import { graphql } from '@/generated/gql';

export const DELETE_GALLERY_ITEM_OR_DEALER_DOC = graphql(`
  mutation DeleteGalleryOrDealerDocument(
    $documentId: String!
    $docType: DeleteDocType!
  ) {
    deleteGalleryOrDealerDocument(documentId: $documentId, docType: $docType) {
      message
      success
    }
  }
`);
