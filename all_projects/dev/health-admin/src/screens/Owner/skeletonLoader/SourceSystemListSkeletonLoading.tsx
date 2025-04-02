import { Skeleton } from '@mantine/core';
import React from 'react';

export default function SourceSystemListSkeletonLoading() {
  return (
    <div className=" flex flex-col space-y-4 w-fit">
      <Skeleton
        height={16}
        width={16}
        radius="xl"
        className="b-1 mx-auto"
      />
      <Skeleton
        height={144}
        mb={12}
        width={144}
      />
    </div>
  );
}
