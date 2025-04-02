import React from 'react';

export function ErrorMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return <p className={` text-xs text-red-500 ${className}`}>{message}</p>;
}
