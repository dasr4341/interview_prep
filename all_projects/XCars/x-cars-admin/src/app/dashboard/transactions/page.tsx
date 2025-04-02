'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const AllTransactions = dynamic(
  () => import('@/components/Transactions/AllTransactions'),
  {
    ssr: false,
  }
);

export default function Page() {
  return <AllTransactions />;
}
