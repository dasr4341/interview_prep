/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../Components/Header/HeaderComponent';
import SidebarComponent from './Components/Sidebar/SidebarComponent';

export default function DashboardPage() {
  
  return (
    <div className='min-w-screen'>
      <div>
        <HeaderComponent />
      </div>
      <div className='flex w-full bg-theme-bg md:h-[calc(100vh_-_6.5rem)]' >
        <SidebarComponent />
        <Outlet />
      </div>
    </div>
  );
}
