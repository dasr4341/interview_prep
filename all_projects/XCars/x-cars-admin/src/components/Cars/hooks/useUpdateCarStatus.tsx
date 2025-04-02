import { CarStatus } from '@/generated/graphql';
import { UPDATE_CAR_STATUS } from '@/graphql/updateCarStatus.mutation';
import catchError from '@/lib/catch-error';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

export const useUpdateCarStatus = ({
  onCompleted,
}: {
  onCompleted?: () => void;
}) => {
  const [updateCarStatus, { loading }] = useMutation(UPDATE_CAR_STATUS, {
    onCompleted: (d) => {
      if (onCompleted) {
        onCompleted();
        toast.success(d.updateCarStatus.message);
      }
      console.log(d);
    },
    onError: (e) => catchError(e, true),
  });

  return {
    updateCarStatus: (carId: string, status: CarStatus) =>
      updateCarStatus({
        variables: {
          cartData: {
            id: carId,
            status: status,
          },
        },
      }),
    loading,
  };
};
