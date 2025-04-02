'use client';
import Navbar from '@/components/Navbar';
import { getCurrentUserDetails } from '../../store/app/app.slice';
import React, { ReactNode, useEffect } from 'react';
import { getAppData } from '@/lib/appData';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state?.app?.user);

  useEffect(() => {
    const isLoggedIn = getAppData().token;
    if (isLoggedIn && !user?.id) {
      dispatch(getCurrentUserDetails());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <section className="h-dvh flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </section>
  );
}
