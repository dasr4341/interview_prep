import dynamic from 'next/dynamic';
import React from 'react';

const CarLeads = dynamic(
  () => import('@/components/Cars/carDetails/CarLeads'),
  {
    ssr: false,
  }
);

export default function page() {
  return <CarLeads />;
}
