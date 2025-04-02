'use client';
import React, { useEffect, Suspense } from 'react';
import { VscError } from 'react-icons/vsc';
import { SiTicktick } from 'react-icons/si';
import { useParams } from 'next/navigation';
import { useLazyQuery } from '@apollo/client';
import { PAYMENT_HISTORY } from '@/graphql/paymentHistory.query';
import catchError from '@/lib/catch-error';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { routes } from '@/config/routes';
import Loading from '@/app/account/orders/[order-id]/loading';

const OrderDetails = () => {
  const { 'order-id': orderId } = useParams<{ 'order-id': string }>();
  const router = useRouter();
  const [getPaymentHistoryCallback, { data: paymentHistory, loading }] =
    useLazyQuery(PAYMENT_HISTORY, {
      onError: (e) => catchError(e, true),
    });
  const handleProductClick = (product: string) => {
    paymentHistory?.getPaymentHistory.data?.carId &&
      router.push(
        routes.buyCars.build(
          `${paymentHistory?.getPaymentHistory.data?.carId}?view=${product}`
        )
      );
  };
  useEffect(() => {
    if (orderId) {
      getPaymentHistoryCallback({
        variables: {
          paymentId: orderId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <Suspense fallback={<Loading />}>
      {loading && <Loading />}
      {!loading && (
        <div className="flex flex-col mx-auto py-12 w-full  items-center text-center">
          <div className="w-2/6 shadow-xl rounded-xl overflow-hidden pb-6">
            <div
              className={`${paymentHistory?.getPaymentHistory.data?.invoiceStatus === 'PAID' ? 'bg-green-700' : 'bg-red-600'} text-white px-10 pb-20 flex flex-col gap-4 items-center`}
            >
              <IoIosArrowBack
                className=" self-start mt-10 cursor-pointer "
                onClick={() => router.back()}
                size={30}
                color="white"
              />
              {paymentHistory?.getPaymentHistory.data?.invoiceStatus ===
              'PAID' ? (
                <SiTicktick className="text-5xl" />
              ) : (
                <VscError className="text-5xl" />
              )}
              <h3 className="text-4xl font-semibold">
                {paymentHistory?.getPaymentHistory.data?.invoiceStatus}
              </h3>

              <p className="text-sm text-slate-200">
                {new Date(paymentHistory?.getPaymentHistory.data?.createdAt)
                  .toString()
                  .substring(0, 25)}
              </p>
            </div>
            <div className="flex flex-col gap-1 p-6 py-10">
              <span className="text-2xl font-semibold">
                Rs. {paymentHistory?.getPaymentHistory.data?.amount} /-
              </span>
              <p className="text-gray-500 px-10">
                {paymentHistory?.getPaymentHistory.data?.invoiceStatus ===
                'PAID'
                  ? 'Congratulations, your order placed successfully. See your products below'
                  : 'We are sorry for you payment goes failed, please try again later'}
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                {paymentHistory?.getPaymentHistory.data?.invoiceStatus ===
                  'PAID' &&
                  paymentHistory?.getPaymentHistory.data.productsPurchased?.map(
                    (item, index) => (
                      <button
                        key={index}
                        onClick={() => handleProductClick(item.fileType)}
                        className="border border-gray-400 rounded-full px-4 py-0.5 text-sm"
                      >
                        {item.fileType}
                      </button>
                    )
                  )}
              </div>
            </div>
            <Link
              href={routes.buyCars.build(
                paymentHistory?.getPaymentHistory.data?.carId || '/'
              )}
              className="bg-orange-600 text-white rounded-full px-8 py-2 mx-auto mb-10"
            >
              Continue
            </Link>
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default OrderDetails;
