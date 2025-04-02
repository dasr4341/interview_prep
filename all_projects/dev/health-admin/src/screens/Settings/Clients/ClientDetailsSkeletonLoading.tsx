import { Skeleton } from '@mantine/core';
import React from 'react';

export default function ClientDetailsSkeletonLoading() {
  return (
    <>
      <section className="w-full p-4 flex flex-col space-y-6 rounded bg-white  mt-10">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
          <Skeleton height={24} width={96} className='col-span-1' />
          <Skeleton height={24} width={96} className='col-span-1' />
          <Skeleton height={24} width={96} className='col-span-1' />
        </div>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
          <Skeleton height={24} width={96} className='col-span-1' />
          <Skeleton height={24} width={96} className='col-span-1' />
          <Skeleton height={24} width={96} className='col-span-1' />
        </div>
      </section>
      <section className="w-full p-4 flex flex-col space-y-6 rounded bg-white">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
          <Skeleton height={24} width={96} className='col-span-1' />
          <Skeleton height={24} width={96} className='col-span-1' />
        </div>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
          <Skeleton height={24} width={96} className='col-span-1' />
          <Skeleton height={24} width={96} className='col-span-1' />
        </div>
      </section>
    </>
  );
}
