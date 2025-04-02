import { Skeleton } from '@mantine/core';
import React from 'react';

export default function TabSkeletonLoading({ className }: { className?: string }) {
  return (
    <div className={`mr-2 ${className}`}>
      <div className="flex flex-col cursor-pointer md:w-32 w-20 capitalize py-8 border-r-2 last:border-r-0">
        <Skeleton height={12} width={48} />
        <Skeleton height={24} mt={12} />
      </div>
    </div>
  );
}
