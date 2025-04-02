import React, { Suspense } from 'react';
import './globals.scss';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import type { Metadata } from 'next';
import { MantineProvider } from '@mantine/core';
import ApolloClientProvider from '@/components/ApolloClientProvider';
import StoreProvider from './StoreProvider';
// import AuthGuard from '@/guards/AuthGuard';
import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthGuard from '@/guards/AuthGuard';
import Loading from './loading';
import { NextUIProvider } from '@nextui-org/react';

export const metadata: Metadata = {
  title: 'X Cars',
  description: 'X Cars admin panel',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ApolloClientProvider>
          <MantineProvider>
            <NextUIProvider>
              <StoreProvider>
                <ToastContainer autoClose={3000} />
                <AuthGuard>
                  <Suspense fallback={<Loading />}>{children}</Suspense>
                </AuthGuard>
              </StoreProvider>
            </NextUIProvider>
          </MantineProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
