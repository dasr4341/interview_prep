import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../Components/Header/HeaderComponent';
import SidebarComponent from './Components/Sidebar/SidebarComponent';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { Drawer, Skeleton } from '@mantine/core';
import './_dashboardPage.scoped.scss';

function DashboardLoadingUi() {
  const { height } = useViewportSize();
  return (
    <Skeleton
      height={height}
    />
  );
}
export default function DashboardPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const { width } = useViewportSize();

  return (
    <div className='flex' data-test-id="dashboard-container">
      {width > 768 && <SidebarComponent />}

      <Drawer
        opened={opened}
        onClose={close}>
        <SidebarComponent />
      </Drawer>

      <div className='w-full dashboard-content' data-test-id="dashboard-content">
        <HeaderComponent
          handleMobileDrawer={open}
          sidebarOpened={opened}
        />
        <Suspense fallback={<DashboardLoadingUi />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
