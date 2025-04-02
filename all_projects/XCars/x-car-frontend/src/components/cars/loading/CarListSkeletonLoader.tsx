import React from 'react';

export const CarListSkeletonLoader = () => (
  <div className=" flex flex-col gap-3 lg:col-span-3 sm:col-span-6 col-span-12 ">
    <div className=" w-full h-40 animate-pulse rounded-md bg-gray-300 "></div>

    <div className=" w-full h-8 animate-pulse rounded-md bg-gray-300 "></div>
    <div className=" flex flex-row flex-wrap  gap-3">
      <div className=" w-3/12 h-6 animate-pulse rounded-md bg-gray-300 "></div>
      <div className=" w-3/12 h-6 animate-pulse rounded-md bg-gray-300 "></div>
      <div className=" w-3/12 h-6 animate-pulse rounded-md bg-gray-300 "></div>
      <div className=" w-3/12 h-6 animate-pulse rounded-md bg-gray-300 "></div>
      <div className=" w-3/12 h-6 animate-pulse rounded-md bg-gray-300 "></div>
    </div>
    <div className=" w-full h-4 animate-pulse rounded-md bg-gray-300 "></div>
  </div>
);

export function CarListSkeletonLoaderGird() {
  return (
    <div className="  grid grid-cols-12 gap-4 ">
      {new Array(6).fill(<CarListSkeletonLoader />).map((e, i) => (
        <React.Fragment key={i}>{e}</React.Fragment>
      ))}
    </div>
  );
}

export function CarCountSkeletonLoader() {
  return (
    <div className=" w-4 h-3 me-1 animate-pulse inline-block rounded-md bg-gray-300 "></div>
  );
}
