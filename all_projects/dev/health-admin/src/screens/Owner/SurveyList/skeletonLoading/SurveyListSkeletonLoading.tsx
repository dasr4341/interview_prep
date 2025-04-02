import { Skeleton } from '@mantine/core';
import React from 'react';

export default function SurveyListSkeletonLoading() {
  return (
    <div
      className="py-6 px-5 bg-white">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Skeleton height={24} />
        </div>
      </div>
    </div>
  );
}
