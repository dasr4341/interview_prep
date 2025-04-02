import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import iconFilter from 'assets/icons/icon_filter.svg';
import { UrlQueryOptions, FilterRangeVariable } from 'interface/url-query.interface';
import { DateRangeTypes } from 'generatedTypes';
import Select from 'react-select';
import { DropdownIndicator } from './ui/SelectBox';
import { timeRange } from '../lib/constant/timeRange';

import './filterToggler.scss';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';

const width = '300px';
const contentStyle = { width, borderColor: '#E5E5EF' };

export default function FilterToggler({
  selectedOptions,
  onChange,
  filterOptions,
  trigger,
  defaultValue,
  hideOptionLabel,
  testid
}: {
  filterOptions: UrlQueryOptions[];
  selectedOptions?: UrlQueryOptions[];
  onChange?: (options: UrlQueryOptions[], selectedTimeRange: DateRangeTypes) => void;
  trigger?: ReactNode;
  defaultValue?: DateRangeTypes | null;
  hideOptionLabel?: boolean;
  testid?: string;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<FilterRangeVariable | any>(null);

  const ref: any = useRef();

  const [optionList, setOptionList] = useState<UrlQueryOptions[]>(filterOptions);

  const dateRangeOptions = useSelector((state: RootState) => state.dataSource.dateRange);

  const closeModal = () => {
    ref.current.close();
    setOpen(false);
  };

  const onApply = () => {
    closeModal();
    const selected = optionList.filter((option) => option.checked);
    if (onChange) {
      onChange(selected, selectedTimeRange?.value);
      setSelectedTimeRange(null);
    }
  };

  function setSelected(sOptions: UrlQueryOptions[], list: UrlQueryOptions[]) {
    const defaultList =
      list?.map((item) => ({
        ...item,
        checked: false,
      })) || [];
    if (sOptions?.length > 0 && Array.isArray(sOptions)) {
      sOptions.forEach((option) => {
        const index = defaultList.findIndex((o) => o.value === option.value);
        // If Found
        if (index > -1 && option.checked) {
          defaultList[index].checked = true;
        }
      });
      setOptionList(defaultList);
    } else {
      setOptionList(defaultList);
    }
  }

  function changeOption(index: number, e: any) {
    optionList[index].checked = e.target.checked as boolean;
    setOptionList(optionList);
  }

  useEffect(() => {
    if (selectedOptions && filterOptions) {
      setSelected(selectedOptions, filterOptions);
    } else {
      setOptionList(filterOptions);
    }
  }, [filterOptions, selectedOptions]);

  const handleRangeValue = () => {
    if (defaultValue) {
      const label = timeRange?.find((item) => item.value === defaultValue);
      if (label && Object.keys(label).length > 0) {
        setSelectedTimeRange(label);
      }
    }
  };

  useEffect(() => {
    handleRangeValue();
    if (!defaultValue) {
      setSelectedTimeRange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, open]);

  return (
    <React.Fragment>
      <Popup
        ref={ref}
        open={open}
        closeOnDocumentClick
        onClose={closeModal}
        trigger={
          <div className="cursor-pointer">
            {trigger ? (
              trigger
            ) : (
              <button role="event-filter" data-test-id="filter-btn">
                <img src={iconFilter} alt="filter" onClick={handleRangeValue} />
              </button>
            )}
          </div>
        }
        position="bottom right"
        {...{ contentStyle }}>
        <div 
        data-test-id={testid}>
          {!hideOptionLabel && (
            <>
              <div className="p-3 max-w-xs mx-auto border-b last:border-0 items-center flex justify-between">
                <div className="text-xs font-semibold">Date Range</div>

                <div className="flex items-center from-gray-150 ">
                  <Select
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: '1px solid hsl(0, 0%, 80%)',
                        boxShadow: 'none',
                        cursor: 'pointer',
                      }),
                      option: (base) => ({
                        ...base,
                        cursor: 'pointer',
                      }),
                    }}
                    className="basic-single rounded-lg mb-1
                    bg-white range-select outline-none"
                    options={dateRangeOptions}
                    isSearchable={false}
                    value={selectedTimeRange}
                    name="range"
                    id="range"
                    components={{
                      IndicatorSeparator: () => null,
                      DropdownIndicator,
                    }}
                    placeholder="Select"
                    onChange={(dateRange) => {
                      if (dateRange) setSelectedTimeRange(dateRange as { label: string; value: DateRangeTypes });
                    }}
                  />
                </div>
              </div>
            </>
          )}
          <div className={`${hideOptionLabel ? '' : 'h-80'} overflow-y-auto`}>
            {optionList.map((option, index) => {
              if (option.section) {
                return (
                  <div key={index} className="text-gray-600 text-sm font-semibold pt-4 uppercase pl-3 pr-3">
                    {option.label}
                  </div>
                );
              } else {
                return (
                  <div className="p-3 max-w-xs mx-auto border-b last:border-0" key={index}>
                    <label data-testid="option" className="flex items-center space-x-3 uppercase cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.value}
                        defaultChecked={option?.checked}
                        className={`appearance-none h-5 w-5 border
                    border-primary-light
                    checked:bg-primary-light checked:border-transparent
                    rounded-md form-tick`}
                        onChange={(e) => changeOption(index, e)}
                      />
                      <span className="text-primary font-semibold text-xs" data-test-id="option-name">{option.label}</span>
                    </label>
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div style={{ width, margin: '-5px' }}>
          <button
            className="bg-primary-light text-white w-full text-center py-2"
            style={{ borderRadius: '0  0 5px 5px' }}
            onClick={onApply}
            data-test-id="apply-button">
            Apply
          </button>
        </div>
      </Popup>
    </React.Fragment>
  );
}
