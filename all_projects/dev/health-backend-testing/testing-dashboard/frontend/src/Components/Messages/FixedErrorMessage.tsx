import React from 'react';

export function FixedErrorMessage({ message, position }: { message: string; position?: 'top' | 'bottom' }) {
    return (
      <div
        className={`fixed left-0 bg-red-100 fixed-error-message
        right-0  p-1 text-center  text-red-900 text-xs
        ${position === 'top' ? 'top-0' : 'bottom-0'}
        `}>
        {message}
      </div>
    );
  }
  