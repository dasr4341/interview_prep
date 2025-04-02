import dynamic from 'next/dynamic';
import React from 'react';

const DealerCars = dynamic(
  () => import('@/components/Dealer/dealerDetails/DealerCars'),
  {
    ssr: false,
  }
);

export default function page() {
  return <DealerCars />;
}
