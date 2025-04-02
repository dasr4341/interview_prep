import React, { ReactNode, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import { PopupPosition } from 'reactjs-popup/dist/types';
import 'reactjs-popup/dist/index.css';
interface PopoverInterface {
  children: ReactNode;
  trigger?: JSX.Element;
  testId?: string;
  triggerClass?: string;
  position?: PopupPosition | PopupPosition[];
  arrowStyle?: any;
  ref?: any;
}

const popupContentStyle = {
  width: '205px',
  borderColor: '#E5E5EF',
  marginLeft: '8px',
};

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



  
export default function Popover({ children, ref, trigger, testId, triggerClass, position = 'bottom right', arrowStyle }: PopoverInterface) {
  const [optionsVisible, setOptionsVisible] = useState(false);

  return (
    <Popup
      ref={ref}
      open={optionsVisible}
      closeOnDocumentClick
      onClose={() => setOptionsVisible(false)}
      onOpen={() => setOptionsVisible(true)}
      trigger={
        <div>
        {trigger || ''}

          {!trigger && (
            <button className={`${triggerClass ? triggerClass : 'text-gray-600 '}`} data-test-id={testId || 'pop-over-trigger-el'}>
              <BsThreeDots />
            </button>
          )}
        </div>
      }
      position={position}
      arrowStyle={{ left: 'calc(100% - 15px)' && arrowStyle }}
      contentStyle={popupContentStyle}>
      <div className="flex flex-col text-xs text-primary font-semibold" onClick={() => setOptionsVisible(false)}>
        {children}
      </div>
    </Popup>
  );
}

export function PopOverItem({ children, onClick, id, className }: { children: ReactNode; onClick?: () => void; id?: string; className?: string }) {
  return (
    <div
      data-test-id={id || 'options'}
      onClick={() => onClick && onClick()}
      className={`${className} border-b py-3 ml-2 hover:text-primary-light 
        uppercase cursor-pointer last:border-b-0`}>
      {children}
    </div>
  );
}
