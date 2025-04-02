import { Skeleton } from '@mantine/core';
import React from 'react';

export default function TemplateFormControlSkeletonLoading() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full items-start">
        <div className="flex space-y-2 flex-col w-full">
          <Skeleton height={32} />
          <Skeleton height={64} />
        </div>
      </div>
      <Skeleton height={128} mt={24} />
    </div>
  );
}
