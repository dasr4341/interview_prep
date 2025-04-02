import React, { ReactNode, Suspense } from 'react';
import Loading from './loading';
import CarDetailsDefaultLayout from '@/components/Cars/carDetails/CarDetailsDefaultLayout';

export default function layout({ children }: { children: ReactNode }) {
  return (
    <CarDetailsDefaultLayout>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </CarDetailsDefaultLayout>
  );
}
