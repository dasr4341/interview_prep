'use client';
import { UPLOAD_CAR_PRODUCTS } from '@/graphql/carProducts.mutation';
import catchError from '@/lib/catch-error';
import { useMutation } from '@apollo/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import DragDropInput from './components/DragDropInput';
import { config } from '@/config/config';
import { DocumentTypeDocumentType } from '@/generated/graphql';
import { ISelectedProduct } from '../Cars/carDetails/CarProducts';

interface IUploadProducts {
  modalState: boolean;
  onClose: () => void;
  onCompleted: () => void;
  selectedProduct: ISelectedProduct | null;
  maxFilesAllowed: number;
}
export default function UploadProducts({
  modalState,
  onClose,
  onCompleted,
  selectedProduct,
  maxFilesAllowed,
}: IUploadProducts) {
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();
  const searchParams = useSearchParams();
  const toUploadDoc = searchParams.get('doc');
  const router = useRouter();

  const [uploadCarProductsCallBack, { loading: uploadCarProductLoading }] =
    useMutation(UPLOAD_CAR_PRODUCTS, {
      onCompleted: (d) => {
        toast.success(d.uploadCarProducts.message);
        onCompleted();
      },
      onError: (e) => catchError(e, true),
    });

  const onDocumentUpload = (
    files: File[],
    fileName: string,
    type: DocumentTypeDocumentType,
    onCompleted: () => void,
    price: number,
    discountedAmount: number
  ) => {
    if (selectedProduct?.id) {
      uploadCarProductsCallBack({
        variables: {
          files: files,
          fileType: fileName,
          amount: price,
          documentType: type,
          carId,
          discountedAmount,
          uploadCarProductsId: selectedProduct.id,
        },
      }).then(() => onCompleted());
    } else {
      uploadCarProductsCallBack({
        variables: {
          files: files,
          fileType: fileName,
          amount: price,
          documentType: type,
          carId,
          discountedAmount,
        },
      }).then(() => onCompleted());
    }
  };

  const handleCloseModal = () => {
    if (toUploadDoc?.length) {
      router.back();
    }
    onClose();
  };

  return (
    <section
      className={`${modalState ? 'block' : 'hidden'} overflow-hidden fixed bg-overlay top-0 left-0 right-0 bottom-0 z-50  backdrop-blur-sm `}
    >
      <div className=" flex flex-col bg-white  rounded-md w-[95%] sm:w-[80%] xl:w-[60%] 2xl:w-1/2 mx-auto absolute transform p-6 left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2">
        <button className=" self-end" onClick={handleCloseModal}>
          <IoMdClose
            size={30}
            className=" text-gray-400 p-1 bg-gray-200 rounded-full"
          />
        </button>
        <div className=" text-gray-900 text-xl font-semibold">Add Products</div>
        <DragDropInput
          defaultData={selectedProduct}
          maxFilesAllowed={maxFilesAllowed}
          isPaid={true}
          loading={uploadCarProductLoading}
          acceptedFiles={Object.values(config.documents.acceptedTypes)}
          onUpload={onDocumentUpload}
        />
      </div>
    </section>
  );
}
