import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';

export default function AppNavLink({
  path,
  name,
  isActive,
  icon,
  isCollapsed,
  className,
  isActiveClassName,
  isClickable,
}: {
  path: string;
  name: string;
  isActive: boolean;
  icon?: ReactNode | null;
  isCollapsed: boolean;
  className?: string;
  isActiveClassName?: string;
  isClickable?: boolean;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        isClickable && router.push(path);
      }}
      className={`flex items-center text-md tracking-wide ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'} ${isActive && isActiveClassName} px-3 py-2 ${
        isCollapsed ? 'justify-center ' : 'gap-4 '
      } ${className}`}
    >
      {icon && icon}
      {!isCollapsed && <div>{name}</div>}
    </div>
  );
}
