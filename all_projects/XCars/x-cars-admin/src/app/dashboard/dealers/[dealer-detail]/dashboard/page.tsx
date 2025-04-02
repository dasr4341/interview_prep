import dynamic from 'next/dynamic';
import React from 'react';

const DealerDashboardPage = dynamic(
  () => import('@/components/Dealer/dealerDetails/DealerDashboardPage'),
  {
    ssr: false,
  }
);

export default function page() {
  return <DealerDashboardPage />;
}
