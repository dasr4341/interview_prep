import dynamic from 'next/dynamic';
import React from 'react';

const DealerLeads = dynamic(
  () => import('@/components/Dealer/dealerDetails/DealerLeads'),
  {
    ssr: false,
  }
);

export default function page() {
  return <DealerLeads />;
}
