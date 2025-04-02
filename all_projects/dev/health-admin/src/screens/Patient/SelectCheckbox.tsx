import React from 'react';

export default function SelectCheckbox({ id, handleClick, selectedCheckBox }) {
  return (
    <input
      id={id}
      type="checkbox"
      name="agreement"
      className="rounded w-6 h-6 border-2 border-[#3B7AF7]"
      onChange={handleClick}
      checked={selectedCheckBox}
    />
  );
}
