import React, { ReactNode, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Popup from 'reactjs-popup';

/**
 * Popover component
 * const items = [
    { title: 'Flag' },
    { title: 'Delete' }
  ];
 * Example: 
 * <Popover>
  {items.map(item => (
    <PopOverItem>
      {item}
    </PopOverItem>
  ))}
 */
export default function Popover({
  children,
  trigger,
  testId
}: {
  children: ReactNode;
  trigger?: JSX.Element;
  testId?: string
}) {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const popupContentStyle = {
    width: '186px',
    borderColor: '#E5E5EF',
    marginLeft: '8px',
  };

  const triggerEL = trigger ? (
    trigger
  ) : (
    <button className="text-gray-600" data-test-id={testId || 'pop-over-trigger-el'}>
      <BsThreeDots />
    </button>
  );

  return (
    <div>
      <Popup
        open={optionsVisible}
        closeOnDocumentClick
        onClose={() => setOptionsVisible(false)}
        onOpen={() => {
          setOptionsVisible(true);
        }}
        trigger={(<div>
          {triggerEL}
        </div>)}
        position="bottom right"
        arrowStyle={{ left: 'calc(100% - 15px)' }}
        contentStyle={popupContentStyle}>
        <div
          className="flex flex-col text-xs text-primary font-semibold"
          onClick={() => {
            setOptionsVisible(false);
          }}>
          {children}
        </div>
      </Popup>
    </div>
  );
}

export function PopOverItem({
  children,
  onClick,
  id
}: {
  children: ReactNode;
  onClick?: () => void;
  id?: string
}) {
  return (
    <div
      data-test-id={id || 'options'}
      onClick={() => (onClick && onClick())}
      className="border-b py-3 ml-2 hover:text-primary-light 
        uppercase cursor-pointer last:border-b-0">
      {children}
    </div>
  );
}
