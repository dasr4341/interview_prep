import { CHECK_CAR_APPROVE_STATUS } from '@/graphql/carApproveStatus.query';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';

export default function useCarApproveStatus({
  onCompleted,
}: {
  carId: string;
  onCompleted?: () => void;
}) {
  const [
    checkCarApproveStatus,
    { data: checkCarApproveStatusData, loading: checkCarApproveStatusLoading },
  ] = useLazyQuery(CHECK_CAR_APPROVE_STATUS, {
    onCompleted: () => {
      if (onCompleted) {
        onCompleted();
      }
    },
    onError: (e) => catchError(e, true),
  });

  return {
    checkCarApproveStatusData,
    checkCarApproveStatusLoading,
    checkCarApproveStatus: (carId: string) => {
      checkCarApproveStatus({
        variables: {
          carId,
        },
      });
    },
  };
}
