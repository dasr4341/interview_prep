/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useLazyQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import catchError from '@/lib/catch-error';
import { message } from '@/config/message';
import { routes } from '@/config/routes';
import DealerQuotationLoader from '@/components/Dealer/loader/DealerQuotationLoader';
import { DEALER_QUOTATION_LIST } from '@/graphql/DealerQuotationList.query';
import NoDataFound from '@/components/NoDataFound';
import {
  Car,
  CarStatus,
  QuotationDetail,
  QuotationStatus,
} from '@/generated/graphql';
import QuotationRow from './components/QuotationRow';

export default function QuotationList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();

  const [quotationList, setQuotationList] = useState<
    {
      carDetails: Car;
      carId: string;
      quotations: { details: QuotationDetail; status: QuotationStatus }[];
    }[]
  >([]);
  const carId = searchParams.get('car-id');

  const [getDealerQuotation, { loading: getQuotationsListLoader }] =
    useLazyQuery(DEALER_QUOTATION_LIST, {
      onCompleted: (d) => {
        const quotationsList = d.getDealerQuotations.data as any;

        const groupedQuotations = quotationsList.reduce(
          (acc: any[], current: any) => {
            const carId = current.key;
            const existingGroup = acc.find((group) => group.carId === carId);
            const quotationList = [...current.quotations].map((quotation) => ({
              status: quotation.status,
              details: quotation.quotationDetails,
            }));
            if (existingGroup) {
              existingGroup.quotations.push(...quotationList);
            } else {
              acc.push({
                carId,
                carDetails: current.quotations[0]?.car,
                quotations: quotationList,
              });
            }
            return acc;
          },
          []
        );
        setQuotationList(groupedQuotations);
      },
      onError: (e) => toast.error(catchError(e)),
    });

  useEffect(() => {
    if (!carId) {
      getDealerQuotation({
        variables: {
          dealerId: dealerId,
        },
      });
    } else if (carId) {
      getDealerQuotation({
        variables: {
          dealerId: dealerId,
          carId: carId,
        },
      });
    } else {
      console.error(message.wrongUrl);
      router.replace(routes.dashboard.children.carsListing.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId]);

  return (
    <section>
      <div className="font-semibold text-3xl text-teal-900 mb-2">
        Quotations
      </div>

      <div className="flex flex-col gap-3 mt-8">
        {getQuotationsListLoader && <DealerQuotationLoader />}
        {!getQuotationsListLoader && !quotationList.length && (
          <NoDataFound message="No quotations found!" />
        )}
        {quotationList.map((quote) => (
          <div
            key={quote.carId}
            className=" bg-gray-50 shadow-lg p-4 rounded-lg"
          >
            <div className=" text-lg text-gray-700 font-bold flex gap-2">
              <span>
                {quote?.carDetails?.launchYear} {quote?.carDetails?.model}{' '}
                {quote?.carDetails?.companyName}
              </span>
              <span
                className={`w-fit text-xs px-2 py-1 my-1 rounded-xl flex justify-center items-center gap-2 text-white ${quote?.carDetails?.status === CarStatus.Approved ? 'bg-green-600' : 'bg-orange-600'}`}
              >
                {quote?.carDetails?.status === CarStatus.Approved ? (
                  <>
                    <div className=" bg-white w-2 h-2 rounded-full"></div>
                    <span>Live</span>
                  </>
                ) : (
                  quote?.carDetails?.status
                )}
              </span>
            </div>
            <div>
              {quote.quotations.map((quotations, index) => (
                <QuotationRow
                  key={index}
                  status={quotations.status}
                  quotationDetails={quotations.details}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
