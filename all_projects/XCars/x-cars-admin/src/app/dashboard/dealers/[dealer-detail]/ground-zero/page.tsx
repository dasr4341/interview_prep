'use client';
import dynamic from 'next/dynamic';

const GroundZero = dynamic(
  () => import('@/components/Dealer/dealerDetails/GroundZero'),
  {
    ssr: false,
  }
);

export default function page() {
  return <GroundZero />;
}
