'use client';
import dynamic from 'next/dynamic';
const CarDetails = dynamic(() => import('@/components/cars/CarDetails'));

const Page = () => {
  return <CarDetails />;
};

export default Page;
