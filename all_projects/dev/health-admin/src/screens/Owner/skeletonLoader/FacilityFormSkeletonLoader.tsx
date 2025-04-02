import { Skeleton } from '@mantine/core';
import React from 'react';

export default function FacilityFormSkeletonLoader() {
  return (
    <div className=" flex flex-col space-y-4">
      <Skeleton height={48} />
      <Skeleton height={48} />
      <Skeleton height={48} />
      <Skeleton height={48} />
      <Skeleton height={48} />
    </div>
  );
}
