import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const MenuPage = () => {

  return (
    <div className='md:p-2 sm:p-1 bg-slate-200 w-full'>
      <div className=''>
        {/* Interactive Tabs */}
        <div className=''>
          <ul className='md:flex text-sm font-medium text-center text-gray-700 border-gray-200 dark:border-gray-700 dark:text-gray-400'>
            <li className='mr-0.5'>
              <NavLink
                to='/dashboard/menu/item_availability'
                aria-current='page'
                className={(navData: { isActive: boolean; }) => (navData.isActive ? 'bg-gray-900 text-white menu-btn lg:w-52' : 'bg-gray-650 text-gray-900 menu-btn lg:w-52')}>
                Item Availability
              </NavLink>
            </li>
            <li className='mr-0.5'>
              <NavLink
                to='/dashboard/menu/menu_editor'
                className={(navData: { isActive: boolean; }) => (navData.isActive ? 'bg-gray-900 text-white menu-btn lg:w-52' : 'bg-gray-650 text-gray-900 menu-btn lg:w-52')}>
                Menu Editor
              </NavLink>
            </li>
            <li className='mr-0.5'>
              <NavLink
                to='/dashboard/menu/out_of_stock'
                className={(navData: { isActive: boolean; }) => (navData.isActive ? 'bg-gray-900 text-white menu-btn lg:w-52' : 'bg-gray-650 text-gray-900 menu-btn lg:w-52')}>
                Out Of Stock
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default MenuPage;
