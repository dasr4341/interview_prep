import { Skeleton } from '@mantine/core';

export const ReportPatientSkeletonLoading = () => {
  return (
      <div className="bg-white flex flex-col p-4">
        <Skeleton height={16} width={96} />
        <Skeleton height={32} mt={16} />
      </div>
  );
};