import React from 'react';

export function ErrorMessage({
  message,
  elementRef,
  className,
}: {
  message: string;
  elementRef?: any;
  className?: string;
}): JSX.Element {
  return (
    <React.Fragment>
      {message && (
        <div
          ref={elementRef}
          className={`${className} text-red-600 text-sm mt-1 margin-top-8 sentence-case`}>
          {message}
        </div>
      )}
    </React.Fragment>
  );
}
