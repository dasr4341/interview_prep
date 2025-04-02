import { DeleteDocType } from '@/generated/graphql';
import { DELETE_GALLERY_ITEM_OR_DEALER_DOC } from '@/graphql/deleteDocumentQuery.mutation';
import catchError from '@/lib/catch-error';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

export default function useRemoveDocument(onCompleted?: () => void) {
  const [deleteDocumentCallBack, { loading }] = useMutation(
    DELETE_GALLERY_ITEM_OR_DEALER_DOC,
    {
      onCompleted: (d) => {
        toast.success(d.deleteGalleryOrDealerDocument.message);
        if (onCompleted) {
          onCompleted();
        }
      },
      onError: (e) => catchError(e, true),
    }
  );

  return {
    deleteDocument: (docId: string, docType: DeleteDocType) =>
      deleteDocumentCallBack({
        variables: {
          documentId: docId,
          docType: docType,
        },
      }),
    loading,
  };
}
