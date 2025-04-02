'use client';
import { getCurrentUserDetails } from '../../store/app/app.slice';
import React, { ReactNode, useEffect, useState } from 'react';
import SideNavbar from '../Appbars/Sidebar/SideNavbar';
import { getAppData } from '@/lib/appData';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const DefaultLayout = ({ children }: { children?: ReactNode }) => {
  const path = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state?.app?.user);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const isLoggedIn = getAppData().token;
    if (isLoggedIn && !user?.id) {
      dispatch(getCurrentUserDetails());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <div
      className={`grid ${isCollapsed ? 'grid-cols-[5rem_1fr]' : 'grid-cols-[16rem_1fr]'} min-h-[100vh] overflow-hidden mx-auto`}
    >
      <SideNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`max-h-[100vh] overflow-y-scroll`}>{children}</div>
    </div>
  );
};

export default DefaultLayout;
