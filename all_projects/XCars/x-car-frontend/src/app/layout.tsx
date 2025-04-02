import type { Metadata } from 'next';
import './globals.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StoreProvider from '@/store/StoreProvider';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import ApolloClientProvider from '@/components/ApolloClientProvider';
import { ReactNode, Suspense } from 'react';
import Loading from './loading';
import DefaultLayout from '@/components/layout/DefaultLayout';
import AuthGuard from '../guards/AuthGuard';

export const metadata: Metadata = {
  title: 'Xcars',
  description: 'Buy and sell cars',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloClientProvider>
          <MantineProvider>
            <StoreProvider>
              <ToastContainer autoClose={3000} />
              <Suspense fallback={<Loading />}>
                <AuthGuard>
                  <DefaultLayout>{children}</DefaultLayout>
                </AuthGuard>
              </Suspense>
            </StoreProvider>
          </MantineProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
