import dynamic from 'next/dynamic';
import React from 'react';

const CarProducts = dynamic(
  () => import('@/components/Cars/carDetails/CarProducts'),
  {
    ssr: false,
  }
);

export default function page() {
  return <CarProducts />;
}
