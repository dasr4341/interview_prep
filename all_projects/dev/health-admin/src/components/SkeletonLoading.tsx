import { Skeleton } from '@mantine/core';
import React from 'react';

export default function SkeletonLoading() {
  return <div className="py-2 px-6 lg:px-16">
   <div
        className='py-6 px-5 bg-white rounded-xl'>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Skeleton height={24} />
          </div>
        </div>
      </div>
  </div>;
}
