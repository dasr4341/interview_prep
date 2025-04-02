import { GetCarDetailAdminQuery } from '@/generated/graphql';
import { GET_CARS_DETAILS } from '@/graphql/getCarDetails.query';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

export default function useGetCarDetails({
  onCompleted,
  carId,
}: {
  // eslint-disable-next-line no-unused-vars
  onCompleted?: (d: GetCarDetailAdminQuery) => void;
  carId: string;
}) {
  const [getCarDetailsCallBack, { refetch, data, loading }] = useLazyQuery(
    GET_CARS_DETAILS,
    {
      onCompleted: (d) => {
        if (onCompleted) {
          onCompleted(d);
        }
      },
      onError: (e) => catchError(e, true),
    }
  );

  useEffect(() => {
    if (carId) {
      getCarDetailsCallBack({
        variables: {
          carId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  return {
    data,
    refetch,
    loading,
    getCarDetailsCallBack,
  };
}
