import React,  { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DisclosureIcon } from './icons/DisclosureIcon';

export default function LinkText({
  children,
  link,
  className
}: {
  children: ReactNode;
  link?: string;
  className?: string;
}) {
  return (
    <Link
      to={link || '/'}
      className={`flex items-center justify-between px-4  py-3 border-b last:border-0 bg-white first:rounded-t-xl last:rounded-b-xl
          ${className}`}>
      <div>{children}</div>
      {link &&
        <span className="cursor-pointer">
          <DisclosureIcon />
        </span>
      }
    </Link>
  );
}