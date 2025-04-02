import React, { ReactNode, Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';

const DefaultLayout = dynamic(
  () => import('@/components/Layouts/DefaultLayout'),
  {
    ssr: false,
  }
);

export default function layout({ children }: { children: ReactNode }) {
  return (
    <section className="">
      <DefaultLayout>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </DefaultLayout>
    </section>
  );
}
