import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex flex-col items-center bg-gray-300 animate-pulse h-[calc(100vh-20%)] w-1/3 rounded-md p-8"></div>
    </div>
  );
}
