import dynamic from 'next/dynamic';
import React from 'react';

const CarDetailsQuotation = dynamic(
  () => import('@/components/Cars/carDetails/CarDetailsQuotation'),
  {
    ssr: false,
  }
);

export default function page() {
  return <CarDetailsQuotation />;
}
