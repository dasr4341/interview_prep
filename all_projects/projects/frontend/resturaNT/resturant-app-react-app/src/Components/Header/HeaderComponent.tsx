/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import CartIcon from '../../Icons/Cart-icon';
import routes from '../../Lib/Routes/Routes';
import { useAppDispatch, useAppSelector } from '../../Lib/Store/hooks';
import { RootState } from '../../Lib/Store/Store';
import { userSliceActions } from '../../Lib/Store/User/User.Slice';

export default function HeaderComponent() {
  const dispatch = useAppDispatch();
  const [breadcrumbToggle, setBreadcrumbToggle] = useState(false);
  const [text, setText] = useState('hidden');
  const [colour, setColour] = useState('800');
  const cartItems = useAppSelector((stateData) => stateData.cart.cart.items).length;

  const handleBreadClick = () => {
    if (breadcrumbToggle) {
      setBreadcrumbToggle(false);
      setColour('800');
      setText('hidden');
    } else {
      setBreadcrumbToggle(true);
      setColour('300');
      setText('md:hidden');
    }
  };

  const onlineState = useSelector((state: RootState) => state.user.onlineState);

  const [online, setonline] = useState(onlineState);
  const [onlinetext, setonlinetext] = useState(onlineState ? 'online' : 'offline');

  const handleonline = () => {
    if (online) {
      setonline(false);
      setonlinetext('offline');
      dispatch(userSliceActions.setOnlineState(false));
    } else {
      setonline(true);
      setonlinetext('online');
      dispatch(userSliceActions.setOnlineState(true));
    }
  };

  function logout() {
    dispatch(userSliceActions.logout());
    dispatch(userSliceActions.setOnlineState(false));
  }

  return (
    <>
      <nav className='bg-white shadow'>
        <div className='mx-auto md:px-8 px-2'>
          <div className='flex h-26 items-center justify-between'>
            <div className='flex text-center text-lg md:w-72 justify-between'>
              <div className='text-lg'>
                <strong>Gangotri</strong>
              </div>
              <div className='hidden md:block'>Manage Orders</div>
            </div>
            <div className='flex justify-between w-56 sm:w-72 md:w-96 text-center'>
              <div className=' flex justify-center items-center '>
                <label htmlFor='toggle' className='inline-flex relative items-center cursor-pointer'>
                  <input
                    onClick={handleonline}
                    type='checkbox'
                    value=''
                    id='toggle'
                    className='sr-only peer'
                    defaultChecked={online}
                  />
                  <div
                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                    peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute 
                    after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 hidden md:block'></span>
                </label>
                <span>{`You are ${onlinetext}`}</span>
              </div>
              <div className='pr-2 relative'>
                <Link to={routes.dashboard.children.cart.fullPath}>
                  <CartIcon style='w-4 md:w-5 hover:cursor-pointer  ' />
                </Link>
                <span className=' p-0.5 w-5 h-5 rounded-xl text-xs absolute top-[-7px] right-[-4px] bg-red-500 text-white '>
                  {cartItems}
                </span>
              </div>
              <div className='block'>
                <div className='flex items-center md:ml-6'>
                  <div className='md:ml-3 relative'>
                    <div className='relative inline-block text-left'>
                      <Popup
                        trigger={
                          <div>
                            <button
                              type='button'
                              className='  flex items-center justify-center w-full rounded-md text-sm font-medium text-gray-700  hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500'
                              id='options-menu'>
                              <svg
                                width='20'
                                fill='currentColor'
                                height='20'
                                className='text-gray-800'
                                viewBox='0 0 1792 1792'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path d='M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z'></path>
                              </svg>
                            </button>
                          </div>
                        }
                        position='bottom center'
                        on='hover'
                        closeOnDocumentClick
                        mouseLeaveDelay={300}
                        mouseEnterDelay={0}
                        contentStyle={{ padding: '0px', border: 'none' }}>
                        <div className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white  ring-1 ring-black ring-opacity-5'>
                          <div className='py-1 ' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
                            <Link
                              to={routes.dashboard.children.me.path}
                              className='block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 outline-none'
                              role='menuitem'>
                              <span className='flex flex-col'>
                                <span>Account</span>
                              </span>
                            </Link>
                            <button
                              onClick={logout}
                              className='block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left'>
                              logout
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='-mr-2 flex md:hidden' onClick={handleBreadClick}>
              <button
                className={`text-gray-800 dark:text-white hover:text-gray-${colour} inline-flex items-center justify-center p-2 rounded-md `}>
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  className='h-8 w-8'
                  viewBox='0 0 1792 1792'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path d='M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z'></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`${text}`}>
          <div className=''></div>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <NavLink
              className={(navData: { isActive: boolean }) => `${(navData.isActive ? 'text-gray-800' : 'text-gray-300')}
              ${online ? '' : 'pointer-events-none'}
               hover:text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium`}
              to='/dashboard/order'
             >
              All Orders
            </NavLink>
            <NavLink
              className={(navData: { isActive: boolean }) => `${(navData.isActive ? 'text-gray-800' : 'text-gray-300')}
               hover:text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium`}
              to='/dashboard/menu'>
              Menu
            </NavLink>
            <NavLink
              className={(navData: { isActive: boolean }) => `${(navData.isActive ? 'text-gray-800' : 'text-gray-300')}
              hover:text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium`}
              to='/dashboard/me'>
              Profile
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}
