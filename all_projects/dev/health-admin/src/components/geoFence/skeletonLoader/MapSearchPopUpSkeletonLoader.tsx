import { Skeleton } from '@mantine/core';
import React from 'react';

export default function MapSearchPopUpSkeletonLoader() {
  return (
    <div className=" flex space-x-4 items-center pl-2   h-6 w-full">
      <div className=" flex justify-between items-center w-full ">
        <Skeleton height={16} width={16} />
        <Skeleton height={24} width={'80%'} />
      </div>
      <Skeleton height={16} width={20} />
    </div>
  );
}
