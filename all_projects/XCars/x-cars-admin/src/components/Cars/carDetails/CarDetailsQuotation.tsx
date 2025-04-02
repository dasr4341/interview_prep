'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import QuotationRow from '../quotation/components/QuotationRow';
import RaiseQuotation from '../quotation/RaiseQuotation';
import NoDataFound from '@/components/NoDataFound';
import { IoIosAddCircleOutline } from 'react-icons/io';
import CarDetailsQuotationLoader from '../loader/CarDetailsQuotationLoader';
import useGetCarDetails from '../hooks/useGetCarDetails';

export default function CarDetailsQuotation() {
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const uploadQuotations = searchParams.get('doc');
  const [quotationModalState, setQuotationModalState] = useState(
    !!uploadQuotations?.length
  );

  const {
    data: details,
    loading: getCarDetailsLoading,
    refetch,
  } = useGetCarDetails({
    carId,
  });

  const toggleModal = () => {
    setQuotationModalState((prev) => !prev);
    if (quotationModalState && uploadQuotations?.length) {
      router.back();
    }
  };

  return (
    <>
      {getCarDetailsLoading && <CarDetailsQuotationLoader />}
      {!getCarDetailsLoading && details && (
        <>
          <div className=" flex justify-between items-center">
            <div className=" flex flex-col">
              <div className="text-gray-700 text-lg font-semibold">
                Raise Quotation
              </div>
            </div>
            <button
              className=" bg-orange-500 font-semibold text-white rounded-md px-4 py-2 text-sm flex justify-center items-center gap-1 hover:bg-orange-600"
              onClick={() => setQuotationModalState(true)}
            >
              <IoIosAddCircleOutline size={20} /> Add Quotations
            </button>
          </div>
          <hr className=" w-full bg-gray-300 mt-4" />

          <div className=" mt-8 flex justify-center flex-col">
            {details?.getCarDetailAdmin.data.quotation &&
              details?.getCarDetailAdmin.data.quotation?.map((item) => (
                <QuotationRow
                  key={item.id}
                  status={item.status}
                  quotationDetails={item?.quotationDetails || null}
                  className=" bg-white rounded-lg"
                />
              ))}
            {!details?.getCarDetailAdmin.data.quotation?.length && (
              <NoDataFound message=" No quotation raised" />
            )}
            {quotationModalState && (
              <RaiseQuotation
                toggleModal={toggleModal}
                onConfirm={() => refetch()}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
