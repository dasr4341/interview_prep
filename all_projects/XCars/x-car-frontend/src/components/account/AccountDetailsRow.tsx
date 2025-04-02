import React from 'react';
export function ProfileDetails({
  label,
  value,
  loading,
  editable = false,
  onChange,
}: {
  label: string;
  value: string | null | undefined;
  loading?: boolean;
  editable?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className=" flex flex-col items-start gap-2 w-11/12 md:w-4/6">
      <span className=" font-light text-base text-gray-700 tracking-wide">
        {label}
      </span>
      <input
        value={value ? value : ''}
        onChange={editable ? onChange : undefined}
        disabled={!editable}
        className={`tracking-wide bg-gray-100 w-full outline-black px-6 rounded-md py-3 ${editable ? ' border border-gray-400 text-gray-500 ' : ' cursor-not-allowed text-gray-400 '} ${loading ? 'animate-pulse h-10 ' : ''}`}
      />
    </div>
  );
}
