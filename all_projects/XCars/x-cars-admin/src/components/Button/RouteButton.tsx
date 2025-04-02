'use client';
import { FC } from 'react';
import { IRoutesDataType } from './routeButton.interface';

const RouteButton: FC<IRoutesDataType> = ({
  item,
  classes,
  onClick,
  children,
}) => {
  return (
    <div onClick={onClick} className={`flex gap-3 items-center ${classes}`}>
      {children}
      <span className="text-md"> {item.name}</span>
    </div>
  );
};

export default RouteButton;
