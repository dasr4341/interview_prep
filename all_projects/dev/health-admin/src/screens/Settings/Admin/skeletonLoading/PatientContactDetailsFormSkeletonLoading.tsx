import { Skeleton } from '@mantine/core';
import React from 'react';

export default function PatientContactDetailsFormSkeletonLoading() {
  return (
    <div className='flex flex-col w-full space-y-6'>
      <Skeleton height={16} width={48} className='self-end'/>
      <Skeleton height={32} />
      <Skeleton height={32} />
      <Skeleton height={32} />
      <Skeleton height={32} />
      <Skeleton height={32} />
    </div>
  );
}
