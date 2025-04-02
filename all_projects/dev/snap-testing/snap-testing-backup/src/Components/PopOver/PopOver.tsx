import VerticalThreeDots from 'Icons/VerticalThreeDots';
import React, { ReactNode, useState } from 'react';
import Popup from 'reactjs-popup';

export default function Popover({ children, trigger }: { children: ReactNode; trigger?: JSX.Element }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupContentStyle = {
    borderColor: '#E5E5EF',
    backgroundColor: '#fff',
  };

  const triggerEL = trigger ? (
    trigger
  ) : (
    <button className='text-gray-600'>
      <VerticalThreeDots className='w-16 h-6 text-semibold' />
    </button>
  );

  return (
    <div>
      <Popup
        open={isOpen}
        closeOnDocumentClick
        onClose={() => setIsOpen(false)}
        onOpen={() => {
          setIsOpen(true);
        }}
        trigger={<div>{triggerEL}</div>}
        arrowStyle={{ right: 'calc(100% - 15px)' }}
        position='bottom right'
        contentStyle={popupContentStyle}>
        <div
          className='flex flex-col text-sm text-primary font-bold border drops-shadow'
          onClick={() => {
            setIsOpen(true);
          }}>
          {children}
        </div>
      </Popup>
    </div>
  );
}

export function PopOverItem({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={() => onClick && onClick()}
      className='border-b py-3 hover:text-primary-light 
        uppercase cursor-pointer last:border-b-0 px-4 hover:bg-gray-100'>
      {children}
    </div>
  );
}
