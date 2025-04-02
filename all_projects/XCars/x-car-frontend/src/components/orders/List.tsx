'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import OrderCards from './OrderCards';
import { useQuery } from '@apollo/client';
import { PAYMENT_HISTORY_LIST } from '@/graphql/paymentHistoryList.query';
import NoDataFound from '../NoDataFound';
import catchError from '@/lib/catch-error';
import OrderCardsLoader from './OrderCardLoader';

const List = () => {
  const router = useRouter();
  const { data: paymentHistoryList, loading } = useQuery(PAYMENT_HISTORY_LIST, {
    onError: (error) => catchError(error, true),
  });
  return (
    <div className="w-8/12 mx-auto flex flex-col gap-6 mt-9">
      <button
        onClick={() => router.back()}
        className=" text-blue-600 flex items-center font-thin text-md"
      >
        <IoIosArrowBack size={20} /> <span>Back</span>
      </button>
      <div className=" font-extrabold text-orange-600 capitalize text-3xl p-1">
        My Orders
      </div>
      <div className="rounded-lg flex flex-col gap-4 justify-between items-center">
        {!loading &&
          !paymentHistoryList?.getPaymentHistoryList?.data?.length && (
            <NoDataFound />
          )}
        {paymentHistoryList?.getPaymentHistoryList.data?.map((data) => (
          <OrderCards
            key={data.id}
            id={data.id}
            status={data.invoiceStatus}
            amount={data.amount}
          />
        ))}
        {loading && <OrderCardsLoader />}
      </div>
    </div>
  );
};

export default List;
