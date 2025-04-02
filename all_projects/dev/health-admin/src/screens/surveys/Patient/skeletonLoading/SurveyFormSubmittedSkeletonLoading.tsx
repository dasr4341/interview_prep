import { Skeleton } from '@mantine/core';
import React from 'react';

export default function SurveyFormSubmittedSkeletonLoading() {
  return (
    <div className="flex justify-between flex-col cursor-pointer px-5 py-6 rounded-xl mb-4 bg-white border-2">
      <Skeleton height={16} mr={24} />
      <Skeleton height={16} mr={24} mt={12} />
    </div>
  );
}
