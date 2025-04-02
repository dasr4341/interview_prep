import { Skeleton } from '@mantine/core';
import React from 'react';

export default function EventRowSkeletonLoading() {
  return (
    <div className="block py-6 px-5 bg-white rounded-xl">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Skeleton height={16} width={32} />
          <Skeleton height={24} mt={6}/>
        </div>
      </div>
    </div>
  );
}
