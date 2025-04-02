import { Application } from '@/generated/graphql';
import { DEALER_DETAILS_QUERY } from '@/graphql/dealerDeatils.query';
import { UPDATE_DEALER_STATUS } from '@/graphql/updateDealerStatus.mutation';
import catchError from '@/lib/catch-error';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export function useDealerStatus(
  status: Application,
  dealerId: string,
  triggerStatusChange: boolean,
  handleTriggerStatusChange?: () => void
) {
  const [updateDealerStatus] = useMutation(UPDATE_DEALER_STATUS, {
    onCompleted: (d) => {
      handleTriggerStatusChange && handleTriggerStatusChange();
      refetch();
      toast.success(d.updateDealerStatus.message);
    },
    onError: (e) => catchError(e, true),
  });

  const [fetchDealerDetails, { data, refetch }] = useLazyQuery(
    DEALER_DETAILS_QUERY,
    {
      onCompleted: (d) => console.log(d),
      onError: (e) => catchError(e, true),
    }
  );

  useEffect(() => {
    if (triggerStatusChange) {
      updateDealerStatus({
        variables: {
          updateDealerStatusId: dealerId as string,
          status: status,
        },
      });
    }
    fetchDealerDetails({
      variables: {
        dealerId: dealerId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId, triggerStatusChange]);

  return data?.viewDealer.data;
}
