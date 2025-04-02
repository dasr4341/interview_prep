import routes from 'Lib/Routes/Routes';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MenuLink({ text, activeMenuPaths }: { text: string; activeMenuPaths?: string }) {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();


  useEffect(() => {
    if (activeMenuPaths && location.pathname) {
      setIsActive(location.pathname.includes(activeMenuPaths));
    }
  }, [location.pathname, activeMenuPaths]);


  return (
    <Link
      className={`hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors  duration-200  text-gray-600 rounded-lg ${isActive ? 'bg-gray-300' : ''}` }
      to={routes.dashboard.children.postList.fullPath}>
      <span className='mx-4 text-lg font-normal'>
        {text}
      </span>
    </Link>
  );
}
