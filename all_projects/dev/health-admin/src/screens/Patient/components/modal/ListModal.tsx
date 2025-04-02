import React from 'react';
import { FilterOptionStateInterface } from 'screens/Patient/PatientList';
import ListModalForm, { PatientFilterDataInterface } from '../form/ListModalForm';
import './_list-modal.scoped.scss';

export default function ListModal({
  options,
  onClose,
  selectedOptions,
  loadingState
}: {
  options: FilterOptionStateInterface;
  onClose: () => void;
  selectedOptions: (e: PatientFilterDataInterface[]) => void;
  loadingState: boolean
}) {
  return (
    <div onClick={() => onClose()} className="fixed top-0 left-0 right-0 bottom-0 overlay bg-overlay  flex items-center justify-center">
      <div className="w-full md:w-5/12 lg:w-3/12 px-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex py-6 px-4  md:px-8 justify-between items-center bg-gray-100">
          <div className="text-md md:text-lg font-bold ">Filter</div>
          <div className=" text-primary-light cursor-pointer font-medium text-sm md:text-base" onClick={() => onClose()}>
            Cancel
          </div>
        </div>
        <ListModalForm loadingState={loadingState}  options={options} selectedOptions={selectedOptions} onClose={onClose} />
      </div>
    </div>
  );
}
