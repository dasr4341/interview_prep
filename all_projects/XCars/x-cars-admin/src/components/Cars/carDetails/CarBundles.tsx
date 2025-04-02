'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLazyQuery } from '@apollo/client';
import catchError from '@/lib/catch-error';
import { GET_CAR_BUNDLES } from '@/graphql/getCarBundles.query';
import BundleCards from '../components/BundleCards';

const CarBundles = () => {
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();

  const [getCarBundlesCallBack, { data }] = useLazyQuery(GET_CAR_BUNDLES, {
    onCompleted: (d) => console.log(d),
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    if (carId) {
      getCarBundlesCallBack({
        variables: {
          carId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className=" flex flex-col mb-8">
        <div className="font-semibold text-3xl text-teal-900 ">
          Car Products Bundles
        </div>
        {data?.getCarBundles.data && data?.getCarBundles.data?.length > 0 && (
          <p className=" text-xs text-gray-700 font-thin">
            This car has a total of {data?.getCarBundles.data?.length} bundled
            product(s)
          </p>
        )}
      </div>
      <div className=" grid grid-cols-12 gap-8">
        {data?.getCarBundles.data && data?.getCarBundles.data?.length ? (
          data?.getCarBundles.data.map((bundle) => (
            <BundleCards
              bundle={bundle}
              className=" xl:col-span-3 col-span-6"
              key={bundle.id}
            />
          ))
        ) : (
          <div className=" text-sm text-gray-500 w-full text-center capitalize col-span-12 ">
            No product bundles have been created for this car.
          </div>
        )}
      </div>
    </div>
  );
};

export default CarBundles;
