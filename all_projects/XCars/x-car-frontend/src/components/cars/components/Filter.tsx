'use client';
/* eslint-disable no-unused-vars */
import React from 'react';
import { PiSirenBold } from 'react-icons/pi';
import { CgProfile } from 'react-icons/cg';
import { BsFuelPumpFill } from 'react-icons/bs';
import { TbSettingsCog } from 'react-icons/tb';
import { Checkbox } from '@mantine/core';
import { FuelType, TransmissionType } from '@/generated/graphql';
import { configVar } from '@/config/config';
import DebouncedRangeSlider from './filter/DebouncedRangeSlider';
import DebouncedSlider from './filter/DebouncedSlider';

interface IFilterProps {
  drivenRange: { min: number; max: number };
  setDrivenRange: (val: { min: number; max: number }) => void;
  noOfOwner: number;
  setNoOfOwner: (val: number) => void;
  fuelFilter: FuelType[];
  setFuelFilter: (val: FuelType[]) => void;
  transmissionFilter: TransmissionType[];
  setTransmissionFilter: (val: TransmissionType[]) => void;
}

const Filter: React.FC<IFilterProps> = ({
  drivenRange,
  setDrivenRange,
  noOfOwner,
  setNoOfOwner,
  fuelFilter,
  setFuelFilter,
  transmissionFilter,
  setTransmissionFilter,
}) => {
  const handleFuelFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    val: FuelType
  ) => {
    if (e.target.checked) {
      setFuelFilter([...fuelFilter, val]);
    } else {
      setFuelFilter(fuelFilter.filter((item) => item !== val));
    }
  };
  const handleTransmissionFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    val: TransmissionType
  ) => {
    if (e.target.checked) {
      setTransmissionFilter([...transmissionFilter, val]);
    } else {
      setTransmissionFilter(transmissionFilter.filter((item) => item !== val));
    }
  };

  return (
    <div className=" max-h-screen overflow-scroll w-[300px] border border-gray-300 rounded-md py-10 px-4 mt-5 flex flex-col gap-10 h-fit">
      <div className="w-full flex flex-col gap-3">
        <div className="text-gray-800 flex font-bold items-center gap-2">
          <PiSirenBold />
          <span>Kms Driven</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="border border-gray-500 px-3 py-1 rounded-md">
            {drivenRange.min} KM
          </span>
          <span className="border border-gray-500 px-3 py-1 rounded-md">
            {drivenRange.max} KM
          </span>
        </div>
        <DebouncedRangeSlider
          onChange={setDrivenRange}
          value={{ min: drivenRange.min, max: drivenRange.max }}
          defaultValue={{ min: configVar.drivenMin, max: configVar.drivenMax }}
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="text-gray-800 flex font-bold items-center gap-2">
          <CgProfile />
          <span>Owners</span>
        </div>
        <div className="flex text-xs self-end border border-gray-500 px-3 py-1 mb-1 rounded-md">
          {noOfOwner}
        </div>
        <DebouncedSlider
          onChange={setNoOfOwner}
          value={noOfOwner}
          defaultValue={configVar.ownersMax}
        />
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="text-gray-800 flex font-bold items-center gap-2">
          <BsFuelPumpFill />
          <span>Fuel</span>
        </div>
        <div className="flex flex-col gap-2">
          {Object.values(FuelType).map((val) => (
            <Checkbox
              key={val}
              onChange={(e) => handleFuelFilter(e, val)}
              checked={fuelFilter.includes(val)}
              color="#ea580c"
              label={val}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="text-gray-800 flex font-bold items-center gap-2">
          <TbSettingsCog />
          <span>Transmission</span>
        </div>
        <div className="flex flex-col gap-2">
          {Object.values(TransmissionType).map((val) => (
            <Checkbox
              key={val}
              onChange={(e) => handleTransmissionFilter(e, val)}
              checked={transmissionFilter.includes(val)}
              color="#ea580c"
              label={val}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
