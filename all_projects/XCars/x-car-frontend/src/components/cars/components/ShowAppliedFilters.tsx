import React from 'react';
import { TransmissionType, FuelType } from '@/generated/graphql';
import { RxCross2 } from 'react-icons/rx';
import { configVar } from '@/config/config';
interface IShowAppliedFiltersProps {
  transmissionFilter: TransmissionType[];
  // eslint-disable-next-line no-unused-vars
  setTransmissionFilter: (val: TransmissionType[]) => void;
  fuelFilter: FuelType[];
  // eslint-disable-next-line no-unused-vars
  setFuelFilter: (val: FuelType[]) => void;
  drivenRange: { min: number; max: number };
  // eslint-disable-next-line no-unused-vars
  setDrivenRange: (val: { min: number; max: number }) => void;
  noOfOwner: number;
  // eslint-disable-next-line no-unused-vars
  setNoOfOwner: (val: number) => void;
}
const ShowAppliedFilters: React.FC<IShowAppliedFiltersProps> = ({
  transmissionFilter,
  setTransmissionFilter,
  fuelFilter,
  setFuelFilter,
  drivenRange,
  setDrivenRange,
  noOfOwner,
  setNoOfOwner,
}) => {
  const handleClearFuelFilter = (val: FuelType) => {
    setFuelFilter(fuelFilter.filter((item) => item !== val));
  };
  const handleTransmissionFilter = (val: TransmissionType) => {
    setTransmissionFilter(transmissionFilter.filter((item) => item !== val));
  };
  return (
    <div className="flex gap-2 flex-wrap">
      {transmissionFilter.map((item) => (
        <div
          key={item}
          className="flex gap-2 items-center bg-gray-200 px-4 py-1 rounded-full text-gray-800 text-sm"
        >
          <span>{item}</span>
          <button onClick={() => handleTransmissionFilter(item)}>
            <RxCross2 />
          </button>
        </div>
      ))}
      {fuelFilter.map((item) => (
        <div
          key={item}
          className="flex gap-2 items-center bg-gray-200 px-4 py-1 rounded-full text-gray-800 text-sm"
        >
          <span>{item}</span>
          <button onClick={() => handleClearFuelFilter(item)}>
            <RxCross2 />
          </button>
        </div>
      ))}
      {(drivenRange.min !== configVar.drivenMin ||
        drivenRange.max !== configVar.drivenMax) && (
        <div className="flex gap-2 items-center bg-gray-200 px-4 py-1 rounded-full text-gray-800 text-sm">
          <span>
            {drivenRange.min} - {drivenRange.max} KMs
          </span>
          <button
            onClick={() =>
              setDrivenRange({
                min: configVar.drivenMin,
                max: configVar.drivenMax,
              })
            }
          >
            <RxCross2 />
          </button>
        </div>
      )}
      {noOfOwner !== configVar.ownersMax && (
        <div className="flex gap-2 items-center bg-gray-200 px-4 py-1 rounded-full text-gray-800 text-sm">
          <span>{noOfOwner} Owners</span>
          <button onClick={() => setNoOfOwner(configVar.ownersMax)}>
            <RxCross2 />
          </button>
        </div>
      )}
      {transmissionFilter.length > 0 ||
      fuelFilter.length > 0 ||
      drivenRange.min !== configVar.drivenMin ||
      drivenRange.max !== configVar.drivenMax ||
      noOfOwner !== configVar.ownersMax ? (
        <div className="flex gap-2 items-center bg-orange-500 px-4 py-1 rounded-full text-white text-sm">
          <span>Clear All</span>
          <button
            onClick={() => {
              setTransmissionFilter([]);
              setFuelFilter([]);
              setDrivenRange({
                min: configVar.drivenMin,
                max: configVar.drivenMax,
              });
              setNoOfOwner(configVar.ownersMax);
            }}
          >
            <RxCross2 />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ShowAppliedFilters;
