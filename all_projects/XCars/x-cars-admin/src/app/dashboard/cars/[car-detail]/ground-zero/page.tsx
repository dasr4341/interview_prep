'use client';
import dynamic from 'next/dynamic';

const GroundZero = dynamic(
  () => import('@/components/Cars/carDetails/GroundZero'),
  {
    ssr: false,
  }
);

export default function page() {
  return <GroundZero />;
}
