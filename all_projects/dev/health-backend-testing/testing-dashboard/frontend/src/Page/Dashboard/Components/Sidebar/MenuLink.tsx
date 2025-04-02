import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MenuLink({
  text,
  activeMenuPaths,
  link
}: {
  text: string;
  activeMenuPaths?: string[];
  link: string;
}) {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (activeMenuPaths && location.pathname) {
      setIsActive(!!activeMenuPaths.find(l => location.pathname.includes(l)));
    }
  }, [location.pathname, activeMenuPaths]);

  return (
    <Link
      className={`hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors  duration-200  text-gray-600 rounded-lg no-underline ${
        isActive ? 'bg-gray-300' : ''
      }`}
      to={link}>
      <span className='mx-4 text-lg font-normal'>{text}</span>
    </Link>
  );
}
