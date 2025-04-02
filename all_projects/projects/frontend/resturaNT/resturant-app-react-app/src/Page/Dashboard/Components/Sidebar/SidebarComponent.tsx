import React from 'react';
import { useSelector } from 'react-redux';
import { OrderPage } from '../../../../Lib/Helper/constants';
import { NavLink } from 'react-router-dom';
import routes from '../../../../Lib/Routes/Routes';
import { RootState } from '../../../../Lib/Store/Store';

export default function SidebarComponent() {
  const onlineState = useSelector((state: RootState) => state.user.onlineState);

  return (
    <div className='block bg-white md:ml-2 md:mt-2 md:mb-2 rounded'>
      <div className='flex-col  justify-center w-44 hidden md:flex h-inherit'>
        <nav className='md:px-6'>
          <NavLink
            className={(navData: { isActive: boolean }) => `${(navData.isActive ? 'opacity-100' : 'opacity-50')}
            ${onlineState ? '' : 'pointer-events-none'}  mt-7 btn-sidebar`}
            to={routes.dashboard.children.order.children.pages.fullPath(OrderPage.NEW_ORDER)}
           >
            <div className='flex flex-col items-center w-full'>
              <img
                src='https://loremflickr.com/200/100/logo'
                alt='Workflow'
                style={{ borderRadius: '50%', height: '51px', width: '51px' }}
              />
              <span className='img-span mt-4'>All Orders</span>
            </div>
          </NavLink>

          <NavLink
            className={(navData: { isActive: boolean }) =>
              navData.isActive ? 'opacity-100 btn-sidebar my-20' : 'opacity-50 btn-sidebar my-20'
            }
            to={routes.dashboard.children.menu.path}>
            <div className='flex flex-col items-center w-full'>
              <img
                src='https://loremflickr.com/200/100/logo'
                alt='Workflow'
                style={{ borderRadius: '50%', height: '51px', width: '51px' }}
              />
              <span className='img-span mt-4'>Menu</span>
            </div>
          </NavLink>

          <NavLink
            className={(navData: { isActive: boolean }) =>
              navData.isActive ? 'opacity-100 btn-sidebar' : 'opacity-50 btn-sidebar'
            }
            to={routes.dashboard.children.me.path}>
            <div className='flex flex-col items-center w-full'>
              <img
                src='https://loremflickr.com/200/100/logo'
                alt='Workflow'
                style={{ borderRadius: '50%', height: '51px', width: '51px' }}
              />
              <span className='img-span mt-4'>Profile</span>
            </div>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
