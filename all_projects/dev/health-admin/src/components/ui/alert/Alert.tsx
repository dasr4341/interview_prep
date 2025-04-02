import React, { ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

export default function Alert({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div
      className="bg-orange text-white flex items-center
       justify-between py-2 px-9"
      data-testid="alert">
      <div data-testid="alert-msg">{children}</div>
      {onClose && (
        <button
          data-testid="btn-close"
          onClick={() => {
            onClose();
          }}>
          <AiOutlineClose size="17.5" />
        </button>
      )}
    </div>
  );
}
