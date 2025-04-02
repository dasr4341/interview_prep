import React, { useState } from 'react';
import Button from 'components/ui/button/Button';
import ListModalFormSkeletonLoading from 'screens/Patient/skeletonLoading/ListModalFormSkeletonLoading';
import { FilterOptionStateInterface } from 'screens/Patient/PatientList';

export interface PatientFilterDataInterface {
  checked: boolean;
  label: string;
  value: string;
}

export default function ListModalForm({
  options,
  selectedOptions,
  onClose,
  loadingState
}: {
  options: FilterOptionStateInterface;
  selectedOptions: (e: PatientFilterDataInterface[]) => void;
  onClose: () => void;
  loadingState: boolean
}) {
  const [currentState, setCurrentState] =
    useState<FilterOptionStateInterface>(options);

  function onSubmit(data: any) {
    data.preventDefault();
    if (currentState.data) {
      selectedOptions(currentState.data);
    }
    onClose();
  }
  function clearAll() {
    setCurrentState({
      ...currentState,
      data: currentState?.data?.map((e) => {
        return {
          ...e,
          checked: false,
        };
      }),
    });
  }

  function handleCheckBox(e: any, i: number) {
    setCurrentState((element) => {
      return {
        ...element,
        data: element?.data?.map((ele: any, index: number) => {
          if (i === index) {
            return {
              ...ele,
              checked: e.target.checked as boolean,
            };
          }
          return ele;
        }),
      };
    });
  }

  return (
    <form
      className=" px-4 md:px-8 py-4 relative bg-white"
      onSubmit={onSubmit}>
      {loadingState && <ListModalFormSkeletonLoading />}
      {currentState.data && (
        <div className="px-2">
          <div
            className="font-medium text-sm clear-btn cursor-pointer underline"
            onClick={() => clearAll()}>
            Clear All
          </div>
          {currentState.data &&
            currentState.data.map((e: any, i: number) => {
              return (
                <div
                  key={e.label}
                  className="py-5 border-b border-gray-350 flex items-center">
                  <input
                    checked={e.checked}
                    type="checkbox"
                    id={`${e.label}`}
                    className="rounded border-2 border-primary-light"
                    onChange={(element) => handleCheckBox(element, i)}
                  />
                  <label
                    htmlFor={`${e.label}`}
                    className="ml-2 text-base font-medium w-full cursor-pointer">
                    {e.label}
                  </label>
                </div>
              );
            })}
          
          <Button
            type="submit"
            classes={['w-full font-medium text-base mt-10']}>
            Submit
          </Button>
        </div>
      )}
    </form>
  );
}
