/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';

export default function ToggleButton({
  status,
  onChange,
  loading,
}: {
  status: boolean;
  onChange: (e: boolean) => void;
  loading?: boolean;
}) {
  const [toggleState, setToggleState] = useState(status);

  function onToggleChange() {
    setToggleState(!toggleState);
    onChange(toggleState);
  }

  return (
    <div
      className={`  transition duration-180 h-7 p-1 flex rounded-3xl items-center font-medium text-sm  text-white  ${
        loading ? 'cursor-wait' : 'cursor-pointer'
      } ${toggleState ? 'bg-theme-color' : 'bg-slate-200'}`}>
      <div
        className={` px-2 ${!toggleState && ' rounded-full bg-theme-color h-full w-6'}`}
        onClick={() => onToggleChange()}></div>
      <div
        className={` px-2 ${toggleState && ' rounded-full bg-white h-full w-6'}`}
        onClick={() => onToggleChange()}></div>
    </div>
  );
}
