'use client';
import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { IoIosAddCircleOutline } from 'react-icons/io';
import catchError from '@/lib/catch-error';
import UploadFiles, {
  UploadDocCategory,
} from '@/components/Documents/UploadFiles';
import { config } from '@/config/config';
import DealerDocumentsLoader from '../loader/DealerDocumentsLoader';
import { IShowDocuments } from '@/components/Documents/interface/showDocuments.interface';
import ShowDocuments from '@/components/Documents/ShowDocuments';
import { DeleteDocType, Status } from '@/generated/graphql';
import NoDataFound from '@/components/NoDataFound';
import { DEALER_DETAILS_DOCUMENTS_QUERY } from '@/graphql/dealerDeatilsDocuments.query';

const DealerDocumentsPage = () => {
  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();
  const toUploadDoc = useSearchParams().get('doc');
  const router = useRouter();
  const [modalState, setModalState] = useState<boolean>(!!toUploadDoc || false);

  const [fetchDealerDetails, { loading: getDetailsLoading, data, refetch }] =
    useLazyQuery(DEALER_DETAILS_DOCUMENTS_QUERY, {
      onCompleted: (d) => console.log(d),
      onError: (e) => catchError(e, true),
    });

  useEffect(() => {
    if (dealerId) {
      fetchDealerDetails({
        variables: {
          dealerId: dealerId,
        },
      });
    } else {
      console.log('invalid id ');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId]);

  const transformDocumentsData = data?.viewDealer.data?.documents?.reduce(
    (acc, { fileType, docs }) => {
      if (fileType) {
        acc[fileType] = {
          amount: '0',
          data: docs as IShowDocuments[],
        };
      }
      return acc;
    },
    {} as { [key: string]: { amount: string; data: IShowDocuments[] } }
  );

  return (
    <>
      {getDetailsLoading && <DealerDocumentsLoader />}
      {!getDetailsLoading && (
        <div className="pb-4 md:my-0">
          <div className=" flex flex-row justify-between items-center">
            <div className="font-semibold text-3xl text-teal-900 mb-2">
              Documents
            </div>

            <button
              className=" bg-orange-500 font-semibold text-white rounded-md px-4 py-2 text-sm flex justify-center items-center gap-1 hover:bg-orange-600"
              onClick={() => setModalState(true)}
            >
              <IoIosAddCircleOutline size={20} /> Upload
            </button>
          </div>

          {!!data?.viewDealer?.data?.documents?.length && (
            <ShowDocuments
              documentsType={DeleteDocType.Dealer}
              documents={
                transformDocumentsData as {
                  [key: string]: { amount: string; data: IShowDocuments[] };
                }
              }
              onDeleteCompleted={() => refetch()}
              isDocumentDeletable={
                data.viewDealer.data.status === Status.Disabled ||
                data.viewDealer.data.status === Status.Pending
                  ? true
                  : false
              }
            />
          )}
          {!data?.viewDealer?.data?.documents?.length && (
            <NoDataFound message={'No documents found '} />
          )}
        </div>
      )}

      <UploadFiles
        title={'Upload Documents'}
        uploadDocCategory={UploadDocCategory.DEALER_DOCUMENT}
        acceptedFiles={[
          config.documents.acceptedTypes.pdf,
          config.documents.acceptedTypes.png,
          config.documents.acceptedTypes.jpg,
        ]}
        onClose={() => {
          setModalState(false);
          !!toUploadDoc?.length && router.back();
        }}
        modalState={modalState}
        fileTypeList={config.documents.admin}
        onCompleted={() => {
          refetch();
          setModalState(false);
          !!toUploadDoc?.length && router.back();
        }}
      />
    </>
  );
};

export default DealerDocumentsPage;
