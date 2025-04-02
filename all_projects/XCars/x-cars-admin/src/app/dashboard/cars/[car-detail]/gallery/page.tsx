import dynamic from 'next/dynamic';
import React from 'react';

const CarDetailsPage = dynamic(
  () => import('@/components/Cars/carDetails/CarDetailsGallery'),
  {
    ssr: false,
  }
);

export default function page() {
  return <CarDetailsPage />;
}
