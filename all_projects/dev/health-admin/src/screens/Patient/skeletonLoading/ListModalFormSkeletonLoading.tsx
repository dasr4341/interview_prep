import { Skeleton } from '@mantine/core';
import React from 'react';

export default function ListModalFormSkeletonLoading() {
  return (
    <div className='my-4'>
      <Skeleton height={12} mb={16} />
      <Skeleton height={12} />
    </div>
  );
}
