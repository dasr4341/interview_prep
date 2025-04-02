import { Skeleton } from '@mantine/core';
import { range } from 'lodash';
import React from 'react';

export default function FacilityChooseLocationSkeleton() {
  return (
    <div className='sm:flex flex-wrap justify-start gap-10'>
      {range(0, 4).map((e) => (
        <div className=" flex flex-col space-y-2 w-fit" key={e}>
          <Skeleton
            height={20}
            width={20}
            radius="sm"
            className="mx-auto"
          />
          <Skeleton
            height={138}
            mb={12}
            width={256}
          />
        </div>
      ))}
    </div>
  );
}
