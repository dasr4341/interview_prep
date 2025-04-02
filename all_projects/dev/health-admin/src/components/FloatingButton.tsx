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
        className={`text-gray-600 w-14 h-14 flex
        items-center justify-center floating-btn transition ease-in-out
        fixed right-12 bottom-12 rounded-full hover:bg-yellow-500 ${open ? 'bg-yellow-500' : 'bg-black'}`}
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
    <>
    <div
      data-testid={id || ''}
      onClick={() => (onClick && onClick())}
      className="pt-4 pb-3 pl-5 transition duration-500 cursor-pointer transform rounded-md">
      {children}
    </div>
    </>
  );
}



