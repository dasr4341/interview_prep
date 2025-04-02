'use client';
import dynamic from 'next/dynamic';

const QuotationList = dynamic(
  () => import('@/components/Cars/quotation/QuotationList'),
  {
    ssr: false,
  }
);
export default function page() {
  return <QuotationList />;
}
