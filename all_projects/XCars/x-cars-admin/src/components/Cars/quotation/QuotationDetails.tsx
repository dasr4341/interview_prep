'use client';
import { DEALER_QUOTATION_LIST } from '@/graphql/DealerQuotationList.query';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { message } from '@/config/message';
import { routes } from '@/config/routes';

export default function QuotationDetails() {
  const router = useRouter();
  const { 'dealer-detail': dealerId, 'quotation-id': carId } = useParams<{
    'dealer-detail': string;
    'quotation-id': string;
  }>();

  const [getDealerQuotationDetails] = useLazyQuery(DEALER_QUOTATION_LIST, {
    onCompleted: (d) => {
      console.log(d);
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    if (dealerId) {
      getDealerQuotationDetails({
        variables: {
          dealerId: dealerId,
          carId: carId,
        },
      });
    } else {
      toast.error(message.wrongUrl);
      router.replace(routes.dashboard.children.carsListing.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId, carId]);

  return <div>QuotationDetails</div>;
}
