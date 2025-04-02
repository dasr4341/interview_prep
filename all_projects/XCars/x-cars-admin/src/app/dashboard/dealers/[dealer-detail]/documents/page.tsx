import dynamic from 'next/dynamic';
import React from 'react';

const DealerDocumentsPage = dynamic(
  () => import('@/components/Dealer/dealerDetails/DealerDocumentsPage'),
  {
    ssr: false,
  }
);

export default function page() {
  return <DealerDocumentsPage />;
}
