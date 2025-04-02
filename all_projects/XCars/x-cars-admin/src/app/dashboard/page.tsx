import React from 'react';
import Stats from '@/components/Dashboard/Stats';

const page = () => {
  return (
    <div className="bg-gray-100 min-h-dvh p-6">
      <div className="font-semibold text-3xl text-teal-900 mb-4">Dashboard</div>
      <Stats />
    </div>
  );
};

export default page;
