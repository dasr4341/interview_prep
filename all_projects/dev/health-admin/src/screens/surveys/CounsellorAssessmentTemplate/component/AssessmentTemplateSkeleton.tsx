import React from 'react';
import { Skeleton } from '@mantine/core';

export default function AssessmentTemplateSkeleton() {
  return (
    <div
      className='block py-6 px-5 bg-white rounded-xl'>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Skeleton height={24} />
        </div>
      </div>
    </div>
  );
}
