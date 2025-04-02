import dynamic from 'next/dynamic';
import React from 'react';

const CarViewersList = dynamic(
  () => import('@/components/Cars/carDetails/CarViewerList'),
  {
    ssr: false,
  }
);

export default function page() {
  return <CarViewersList />;
}
