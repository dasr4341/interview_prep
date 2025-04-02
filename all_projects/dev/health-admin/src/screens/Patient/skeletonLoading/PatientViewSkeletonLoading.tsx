import { Skeleton } from '@mantine/core';
import React from 'react';

export default function PatientViewSkeletonLoading() {
  return (
    <div  className="font-bold text-base py-7 px-6 bg-white flex justify-between  border-b">
      <Skeleton height={20} width={96} />
      <Skeleton height={20} width={32} radius={'md'} />
    </div>
  );
}
