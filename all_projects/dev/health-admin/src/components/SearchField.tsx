import React, { ChangeEvent, useEffect, useRef, useState, useId } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import Search from './icons/Search';
import { TextInput, Tooltip } from '@mantine/core';
import CloseIcon from './icons/CloseIcon';
import './_search-field.scoped.scss';

export default function SearchField({
  defaultValue,
  onChange,
  clear,
  placeHolder,
  clearSearchValue
}: {
  defaultValue?: string;
  onChange: (e: string) => void;
  clear?: boolean;
  placeHolder?: string;
  clearSearchValue?: () => void;
}) {
  const [searchedValue, setSearchedValue] =  useDebouncedState('', 400);
  const inputRef = useRef<any>(null);
  const [clearSearchPhase, setClearSearchPhase] = useState(false);

  function setInputValue(value: string) {
    if (inputRef.current) {
      inputRef.current.value = value || '';
    }
  }
  function inputHandler(event: ChangeEvent<HTMLInputElement>) {
    const searchData = event.target.value;
    if (searchData.trim().length === 0) {
      setSearchedValue('');
    } else if (searchData && searchData.trim().length >= 3) {
      setSearchedValue(searchData.trim());
    }
  }

  const clearValue = () => {
    if (clearSearchValue) {
      clearSearchValue();
    } else {
      setClearSearchPhase(!clearSearchPhase);
      setSearchedValue('');
      setInputValue('');
    }
  };

  useEffect(() => {
    onChange(searchedValue);
  }, [searchedValue]);

  useEffect(() => {
    setSearchedValue('');
    setInputValue('');
  }, [clear, clearSearchPhase]);

  useEffect(() => {
    setInputValue(defaultValue || '');
  }, [defaultValue]);
 
  return (
    <div className="min-w-240 md:min-w-300 relative">
      <Tooltip
        multiline
        label="Minimum three characters are required to search"
        position="bottom"
        withArrow
        arrowSize={10}
        events={{ hover: true, focus: true, touch: false }}
        color="gray"
        className="z-50">
        <TextInput
          wrapperProps={{
            className: ' border-transparent focus:border-transparent focus:ring-0 ',
          }}
          id="outlined-basic"
          onChange={inputHandler}
          name={useId()}
          placeholder={placeHolder ? placeHolder : 'Search'}
          size="small"
          ref={inputRef}
          icon={
            <div className="search-icon">
              <Search className="w-4 h-4" />
            </div>
          }
          rightSection={
            <>
              {!!inputRef?.current?.value?.length && (
                <div
                  className="cross-btn"
                  onClick={clearValue}>
                  <CloseIcon className=" w-5 h-5 bg-gray-200 p-1 rounded-full cursor-pointer" />
                </div>
              )}
            </>
          }
        />
      </Tooltip>
    </div>
  );
}

