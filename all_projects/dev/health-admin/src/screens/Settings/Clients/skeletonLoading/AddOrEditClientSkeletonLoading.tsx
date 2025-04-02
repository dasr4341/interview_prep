import { Skeleton } from '@mantine/core';
import React from 'react';

export default function AddOrEditClientSkeletonLoading() {
  return (
    <section>
      <label htmlFor="name" className="block mb-2 text-xsm font-normal text-gray-750 dark:text-white">
        Client Name
      </label>
      <Skeleton height={56} mb={24} />
      
    </section>
  );
}
