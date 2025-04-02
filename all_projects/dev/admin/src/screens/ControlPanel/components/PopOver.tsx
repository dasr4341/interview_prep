import React, { ReactNode, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Popup from 'reactjs-popup';

export default function Popover({ children, trigger }: { children: ReactNode; trigger?: JSX.Element }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupContentStyle = {
    width: '227px',
    borderColor: '#E5E5EF',
    marginLeft: '8px',
  };

  const triggerEL = trigger ? (
    trigger
  ) : (
    <button className="text-gray-600">
      <BsThreeDots />
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
        position="bottom right"
        arrowStyle={{ left: 'calc(100% - 15px)' }}
        contentStyle={popupContentStyle}>
        <div
          className="flex flex-col text-xs text-primary font-semibold"
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
      className="border-b py-3 ml-2 hover:text-primary-light 
        uppercase cursor-pointer last:border-b-0">
      {children}
    </div>
  );
}
