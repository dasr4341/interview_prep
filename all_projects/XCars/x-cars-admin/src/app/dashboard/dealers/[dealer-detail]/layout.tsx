import React, { ReactNode, Suspense } from 'react';
import Loading from './loading';
import DealerDetailsDefaultLayout from '@/components/Dealer/dealerDetails/DealerDetailsDefaultLayout';

export default function layout({ children }: { children: ReactNode }) {
  return (
    <DealerDetailsDefaultLayout>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </DealerDetailsDefaultLayout>
  );
}
