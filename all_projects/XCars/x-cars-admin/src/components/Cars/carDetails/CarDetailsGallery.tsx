'use client';
import React, { useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import CarDetailsGalleryLoader from '../loader/CarDetailsGalleryLoader';
import useGetCarDetails from '../hooks/useGetCarDetails';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DeleteDocType } from '@/generated/graphql';
import ShowDocuments from '@/components/Documents/ShowDocuments';
import UploadFiles, {
  UploadDocCategory,
} from '@/components/Documents/UploadFiles';
import { config } from '@/config/config';
import NoDataFound from '@/components/NoDataFound';
import { IShowDocuments } from '@/components/Documents/interface/showDocuments.interface';

export default function CarDetailsGallery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uploadDocuments = searchParams.get('doc');
  const { 'car-detail': carId } = useParams<{ 'car-detail': string }>();
  const {
    data: details,
    loading: getCarDetailsLoading,
    refetch,
  } = useGetCarDetails({ carId });
  const [modalState, setModalState] = useState<boolean>(
    !!uploadDocuments?.length
  );

  const transformDocumentsData =
    details?.getCarDetailAdmin.data?.gallery?.reduce(
      (acc, { fileType, documents }) => {
        const key = fileType;
        acc[key] = {
          amount: '0',
          data: documents as IShowDocuments[],
        };
        return acc;
      },
      {} as { [key: string]: { amount: string; data: IShowDocuments[] } }
    );

  const modifyDocumentsArray = () => {
    if (uploadDocuments?.length) {
      return Object.values(config.documents.cars)
        .sort((a, b) =>
          a.value === uploadDocuments ? -1 : b.value === uploadDocuments ? 1 : 0
        )
        .slice(0, 1);
    }
    return Object.values(config.documents.cars);
  };

  return (
    <div>
      {getCarDetailsLoading && <CarDetailsGalleryLoader />}
      {!getCarDetailsLoading && details && (
        <>
          <div className="flex flex-row justify-between items-center">
            <div>
              <div className="text-gray-900 text-lg font-semibold">Gallery</div>
              <p className="text-xs text-gray-500 font-thin">
                Upload the car-related free images and videos to proceed to the
                next step.
              </p>
            </div>

            <button
              className=" bg-orange-500 font-semibold text-white rounded-md px-4 py-2 text-sm flex justify-center items-center gap-1 hover:bg-orange-600"
              onClick={() => setModalState(true)}
            >
              <IoIosAddCircleOutline size={20} /> Upload
            </button>
          </div>
          <hr className="w-full bg-gray-300 mt-4" />

          {!!details?.getCarDetailAdmin?.data?.gallery?.length && (
            <ShowDocuments
              documentsType={DeleteDocType.CarGallery}
              documents={
                transformDocumentsData as {
                  [key: string]: { amount: string; data: IShowDocuments[] };
                }
              }
              onDeleteCompleted={() => refetch()}
              isDocumentDeletable={true}
            />
          )}

          {details?.getCarDetailAdmin?.data?.gallery &&
            !details?.getCarDetailAdmin?.data?.gallery.length && (
              <NoDataFound message={'No documents found '} />
            )}

          <UploadFiles
            title="Upload Gallery"
            uploadDocCategory={UploadDocCategory.CAR_GALLERY}
            acceptedFiles={[
              config.documents.acceptedTypes.png,
              config.documents.acceptedTypes.mp4,
              config.documents.acceptedTypes.jpg,
            ]}
            onClose={() => {
              setModalState(false);
              !!uploadDocuments?.length && router.back();
            }}
            modalState={modalState}
            fileTypeList={modifyDocumentsArray()}
            onCompleted={() => {
              refetch();
              setModalState(() => false);
              !!uploadDocuments?.length && router.back();
            }}
          />
        </>
      )}
    </div>
  );
}
