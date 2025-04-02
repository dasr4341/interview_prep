import { GetAllCareTeamType_pretaaHealthGetAllCareTeamType } from 'health-generatedTypes';
import React, { useState } from 'react';

interface ICareTeamType<T> extends GetAllCareTeamType_pretaaHealthGetAllCareTeamType {
  setCareTeamTypes: React.Dispatch<React.SetStateAction<T[]>>;
  index: number;
}
export default function CareTeam({
  defaultValue,
  updatedValue,
  description,
  setCareTeamTypes,
  index,
}: ICareTeamType<GetAllCareTeamType_pretaaHealthGetAllCareTeamType>) {
  const [inputValue, setInputValue] = useState(() => updatedValue || defaultValue);

  return (
    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:items-center">
      <div className="  font-bold text-base md:w-5/12 2xl:w-6/12  ">
        <h1 className='capitalize'>{defaultValue}</h1>
        <div className="text-sm care-team-label font-normal leading-6 md:w-10/12">
          {description}
        </div>
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(v) => {
          setInputValue(v.target.value);
          setCareTeamTypes((state) =>
            state.map((careType, i) => {
              if (i === index) {
                return {
                  ...careType,
                  updatedValue: v.target.value,
                };
              }
              return careType;
            }),
          );
        }}
        placeholder={`Change ${defaultValue}`}
        className={'md:w-5/12 rounded border-gray-350 py-3'}
      />
    </div>
  );
}
