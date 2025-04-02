import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../Components/Header/HeaderComponent';
import SidebarComponent from './Components/Sidebar/SidebarComponent';

export default function DashboardPage() {
  return (
    <div className='flex'>
      <SidebarComponent />
      <div className='w-full'>
        <HeaderComponent />
        <Outlet />
      </div>
    </div>
  );
}
