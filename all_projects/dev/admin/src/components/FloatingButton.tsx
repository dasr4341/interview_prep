import React, { ReactNode, useRef, useState } from 'react';
import { BsPlus, BsX } from 'react-icons/bs';
import Popup from 'reactjs-popup';

export default function AddFloatingButton({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<any>();
  function toggle() {
    ref.current.toggle();
    setOpen(!open);
  }

  return (
    <>
      <Popup
        ref={ref}
        open={open}
        onClose={() => setOpen(false)}
        className="floating-modal"
        position="top right"
        trigger={(
          <div className="fixed right-12 bottom-12 w-14 h-14"></div>
        )}
        >
        {children}
      </Popup>
      <button
        className="text-gray-600 w-14 h-14 flex
            items-center justify-center floating-btn
            fixed right-12 bottom-12 bg-primary-light rounded-full"
        onClick={() => toggle()}
        data-test-id="floating-btn"
        >
        {open && <BsX className="text-white text-lg" />}
        {!open && <BsPlus className="text-white text-lg" />}
      </button>
    </>
  );
}

export function FloatingButtonItem({
  children,
  onClick,
  id
}: {
  children: ReactNode;
  onClick?: () => void;
  id?: string;
}) {
  return (
    <div
      data-testid={id || ''}
      onClick={() => (onClick && onClick())}
      className="pt-4 pb-3 ml-5 hover:text-primary-light 
        cursor-pointer">
      {children}
    </div>
  );
}
