import React from 'react';
import './_error-message.scoped.scss';

export function ErrorMessage({ message, testId, elementRef, className }: { message: string; testId?: string, elementRef?:any, 
  className?: string }): JSX.Element {
  return (
    <React.Fragment>
      {message && (
        <div ref={elementRef} className={`${className} text-red-800 text-sm mt-1 margin-top-8 sentence-case`} data-testid={testId ? testId : 'error-id'}>
          {message}
        </div>
      )}
    </React.Fragment>
  );
}

export function SuccessMessage({ message, testId }: { message: string; testId?: string }): JSX.Element {
  return (
    <React.Fragment>
      {message && (
        <div className="text-green text-sm mt-1 margin-top-8 sentence-case" data-testid={testId ? testId : 'error-id'}>
          {message}
        </div>
      )}
    </React.Fragment>
  );
}

export function ErrorMessageSmall({ message, testId, className }: { message: string; testId?: string; className?: string }): JSX.Element {
  return (
    <React.Fragment>
      {message && (
        <div className={`text-red-800 text-sm mb-1 sentence-case ${className}`} data-testid={testId ? testId : 'error-id'}>
          {message}
        </div>
      )}
    </React.Fragment>
  );
}

// by default -> fixed bottom
export function ErrorMessageFixed({ message, position }: { message: string; position?: 'top' | 'bottom' }) {
  return (
    <div
      className={`fixed left-0 bg-red-100 fixed-error-message
      right-0  p-1 text-center text-gray-150 text-xs
      ${position === 'top' ? 'top-0' : 'bottom-0'}
      `}>
      {message}
    </div>
  );
}
