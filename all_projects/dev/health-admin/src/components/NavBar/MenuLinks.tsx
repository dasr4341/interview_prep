import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function getMenuClass({
  isActive,
  level,
}: {
  isActive: boolean;
  level?: string;
}) {
  let menuClass = 'text-primary block pb-2 nav-link-fontsize text-primary';
  if (isActive && !level) {
    menuClass = menuClass + ' font-bold underline navlink-underline-active';
  }

  if (level === 'level-1') {
    if (isActive) {
      menuClass = 'bg-white text-primary px-8 py-3 -ml-6 lg:-ml-6 -mr-12 lg:-mr-12 rounded-l-2xl lg:rounded-l-full';
    } else {
      menuClass = 'text-white px-8 py-3 -ml-6 lg:-ml-6 -mr-12 lg:-mr-12';
    }
  }

  if (level === 'level-2') {
    if (isActive) {
      menuClass = 'bg-white text-primary px-6 py-2.5 lg:-ml-6 lg:rounded-full lg:-mt-2';
    } else {
      menuClass = 'text-white text-base';
    }
  }

  return menuClass;
}

export default function MenuLink({
  to,
  text,
  activeMenuPaths,
  level,
  onClick
}: {
  text: string;
  activeMenuPaths?: string;
  to: string;
  level?: 'level-1' | 'level-2';
  onClick?: () => void
}) {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (activeMenuPaths && location.pathname) {
      setIsActive(location.pathname.includes(activeMenuPaths));
    }
  }, [location.pathname, activeMenuPaths]);

  return (
    <Link
      onClick={onClick}
      className={getMenuClass({ isActive, level })}
      to={to}>
      {text}
    </Link>
  );
}

