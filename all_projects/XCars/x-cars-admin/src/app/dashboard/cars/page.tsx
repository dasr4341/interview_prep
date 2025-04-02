import React from 'react';
import dynamic from 'next/dynamic';

const CarList = dynamic(() => import('@/components/Cars/CarListPage'), {
  ssr: false,
});

const page = () => {
  return <CarList />;
};

export default page;
