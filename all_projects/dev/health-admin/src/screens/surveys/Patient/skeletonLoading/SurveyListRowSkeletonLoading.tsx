import { Skeleton } from '@mantine/core';
import React from 'react';

export default function SurveyListRowSkeletonLoading() {

  return (
    <div className="flex flex-col bg-white border-b border-gray-100 px-5 py-6">
      <Skeleton height={16} width={64} />
      <Skeleton height={24} mt={6} />
    </div>
  );
}
