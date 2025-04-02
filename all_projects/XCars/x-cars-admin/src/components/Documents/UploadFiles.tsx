import { DocumentTypeDocumentType, FileType } from '@/generated/graphql';
import { UPLOAD_DEALER_DOCUMENT } from '@/graphql/uploadDocument.mutation';
import catchError from '@/lib/catch-error';
import { useMutation } from '@apollo/client';
import { useParams } from 'next/navigation';
import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import DragDropInput from './components/DragDropInput';
import { UPLOAD_CAR_GALLERY } from '@/graphql/uploadCarGalleryDocuments.mutation';
import { config } from '@/config/config';

export enum UploadDocCategory {
  // eslint-disable-next-line no-unused-vars
  CAR_GALLERY = 'CAR_GALLERY',
  // eslint-disable-next-line no-unused-vars
  CAR_PRODUCTS = 'CAR_PRODUCTS',
  // eslint-disable-next-line no-unused-vars
  DEALER_DOCUMENT = 'DEALER_DOCUMENT',
}

export default function UploadFiles({
  title,
  modalState,
  onCompleted,
  onClose,
  acceptedFiles,
  fileTypeList,
  uploadDocCategory,
}: {
  title: string;
  modalState: boolean;
  onClose: () => void;
  onCompleted: () => void;
  acceptedFiles: string[];
  fileTypeList?: { value: string; label: string }[];
  uploadDocCategory: UploadDocCategory;
}) {
  const { 'car-detail': carId, 'dealer-detail': dealerId } = useParams<{
    'car-detail': string;
    'dealer-detail': string;
  }>();

  const [uploadDealerDocCallBack, { loading: uploadFileLoading }] = useMutation(
    UPLOAD_DEALER_DOCUMENT,
    {
      onCompleted: (d) => {
        toast.success(d.uploadUserDocument.message);
        onCompleted();
      },
      onError: (e) => catchError(e, true),
    }
  );

  const [UploadCarGalleryDocuments, { loading: uploadCarGalleryLoading }] =
    useMutation(UPLOAD_CAR_GALLERY, {
      onCompleted: (d) => {
        toast.success(d.uploadCarGalleryDocuments.message);
        onCompleted();
      },
      onError: (e) => catchError(e, true),
    });

  const onDocumentUpload = (
    selectedFile: File[],
    fileName: string,
    type: DocumentTypeDocumentType,
    onCompleted: () => void
  ) => {
    switch (uploadDocCategory) {
      case UploadDocCategory.CAR_GALLERY:
        UploadCarGalleryDocuments({
          variables: {
            carId: carId,
            files: selectedFile,
            fileType: fileName,
            documentType: type,
            isThumbnail: fileName === config.documents.cars.thumbnail.value,
          },
        }).finally(() => onCompleted());
        break;
      case UploadDocCategory.DEALER_DOCUMENT:
        uploadDealerDocCallBack({
          variables: {
            dealerId,
            files: selectedFile,
            fileType: fileName,
            uploadCategory:
              type === DocumentTypeDocumentType.Document
                ? FileType.Documents
                : FileType.Images,
          },
        }).then(() => onCompleted());
        break;
      default:
        break;
    }
  };

  return (
    <section
      className={`${modalState ? 'block' : 'hidden'} overflow-hidden fixed bg-overlay top-0 left-0 right-0 bottom-0 z-50  backdrop-blur-sm `}
    >
      <div className=" flex flex-col bg-white  rounded-md w-[95%] sm:w-[80%] xl:w-[60%] 2xl:w-1/2 mx-auto absolute transform p-6 left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2">
        <button className=" self-end" onClick={onClose}>
          <IoMdClose
            size={30}
            className=" text-gray-400 p-1 bg-gray-200 rounded-full"
          />
        </button>
        <div className=" text-gray-900 text-xl font-semibold">{title}</div>
        <DragDropInput
          loading={uploadFileLoading || uploadCarGalleryLoading}
          acceptedFiles={acceptedFiles}
          onUpload={onDocumentUpload}
          fileTypeList={fileTypeList || []}
        />
      </div>
    </section>
  );
}
