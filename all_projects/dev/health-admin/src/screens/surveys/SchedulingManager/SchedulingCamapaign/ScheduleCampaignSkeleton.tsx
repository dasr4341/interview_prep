import { Skeleton } from '@mantine/core';
import React from 'react';
export default function ScheduleCampaignSkeleton() {
  return (
    <div className="mt-6 px-5 lg:px-16 py-5 lg:py-8 sm:py-10">
      <Skeleton height={16} width={'50%'} />
      <Skeleton height={16} width={'50%'} mt={48} />
      <Skeleton height={48} width={'50%'} mt={40} />
      <div className="mt-6 md:flex w-1/2 ">
        <Skeleton height={48} width={'66%'} mt={24} />
        <Skeleton height={48} width={'66%'} mt={24} className='md:ml-6' />
      </div>
      <div className="mt-12 md:flex w-1/2 ">
        <Skeleton height={48} width={'66%'} />
        <Skeleton height={48} width={'33%'} className='md:ml-6' />
      </div>
      <Skeleton height={48} width={'25%'} mt={48} />
      <Skeleton height={48} width={'25%'} mt={48} />
      <Skeleton height={16} width={'20%'} mt={64} />
    </div>
  );
}