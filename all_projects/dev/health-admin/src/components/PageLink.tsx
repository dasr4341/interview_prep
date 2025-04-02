import React from 'react';
import { DisclosureIcon } from './icons/DisclosureIcon';
import { Link, To } from 'react-router-dom';

export default function PageLinks({
  children = <></>,
  className,
  linkTo,
  testId,
  count,
  text = '',
  tabIndex,
  onClick,
}: {
  children?: JSX.Element;
  className?: string;
  linkTo?: To;
  testId?: string;
  count?: number;
  text?: string;
  tabIndex?: number;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick}>
      <Link
        tabIndex={tabIndex}
        to={linkTo || ''}
        data-testid={testId || ''}
        className={`flex cursor-pointer items-center font-normal flex-row justify-between px-4 py-3 w-full border-b border-border ${className}`}>
        <p>
          {children}
          {text}
          {Number(count) > 0 && (
            <span className="text-orange ml-1.5">({count})</span>
          )}
        </p>
        <DisclosureIcon />
      </Link>
    </div>
  );
}
