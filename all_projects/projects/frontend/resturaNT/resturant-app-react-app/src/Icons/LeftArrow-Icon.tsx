import React from 'react';

function LeftArrowIcon({
  className,
  color,
  onCLick
}: {
    className: string,
    color?: string
    onCLick: () => void
}) {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg"
        onClick={() => onCLick()}
        className={className} viewBox="0 0 25 25"><path fill={color} d="M7 12.5 17.293 2l.707.707L8.414 12.5 18 22.293l-.707.707L7 12.5z" /></svg>
    </>
  );
}

export default LeftArrowIcon;