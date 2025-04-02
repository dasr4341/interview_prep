import { Skeleton } from '@mantine/core';
import React from 'react';

export default function SurveyFormPreviewSkeletonLoading() {
  return (
    <div className='my-2'>
      <Skeleton height={16} width={'33%'} />
      <Skeleton height={40} mt={8} />
   </div>
  );
}
