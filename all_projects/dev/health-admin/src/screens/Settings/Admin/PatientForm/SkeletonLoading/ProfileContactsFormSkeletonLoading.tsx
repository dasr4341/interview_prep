import { Skeleton } from '@mantine/core';
import React from 'react';

export default function ProfileContactsFormSkeletonLoading() {
  return (
    <div className="flex flex-col space-y-6 px-6 lg:px-16 mt-10 pb-32">
      <Skeleton height={48} className='w-full md:w-1/2' />
      <Skeleton height={48} className='w-full md:w-1/2' />
      <Skeleton height={48} className='w-full md:w-1/2' />
      <Skeleton height={48} className='w-full md:w-1/2' />
      <Skeleton height={48} className='w-full md:w-1/2' />
      <Skeleton height={48} className='w-full md:w-1/2' />
      <Skeleton height={48} className='w-full md:w-1/2' />
      <Skeleton height={48} className='w-full md:w-1/2' />
      <Skeleton height={48} className='w-full md:w-1/2' />
    </div>
  );
}
