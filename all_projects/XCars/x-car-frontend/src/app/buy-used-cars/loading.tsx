import { CarListSkeletonLoaderGird } from '@/components/cars/loading/CarListSkeletonLoader';
import React from 'react';

export default function Loading() {
  return (
    <section className="sm:w-10/12 md::w-8/12 w-full mx-auto mb-6 flex gap-6 relative">
      <div className=" bg-gray-300 animate-pulse rounded-md h-100vh w-1/4"></div>
      <div className="sm:w-10/12 md:w-8/12 w-full mx-auto flex gap-4 flex-col ">
        <div className=" w-1/3 h-4 animate-pulse rounded-md bg-gray-300 "></div>
        <div className=" w-full h-8 animate-pulse  rounded-md bg-gray-300 "></div>
        <CarListSkeletonLoaderGird />
      </div>
    </section>
  );
}
