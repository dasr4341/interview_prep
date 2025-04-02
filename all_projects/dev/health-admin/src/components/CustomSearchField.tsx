import React, { ChangeEvent, useEffect, useId, useRef } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { TextInput, Tooltip } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';

import './_search-field.scoped.scss';
import Search from 'components/icons/Search';
import CloseIcon from 'components/icons/CloseIcon';
import { getSearchedPhaseQuery } from './lib/CustomSearchFieldLib';
import { routes } from 'routes';

export default function CustomSearchField({
  defaultValue,
  onChange,
  placeHolder,
  clear

}: {
  defaultValue: string;
  onChange: (e: string) => void;
  placeHolder?: string;
  clear?: boolean;
}) {

  const [searchedPhase, setSearchedPhase] = useDebouncedState(
    getSearchedPhaseQuery(location.search) ? getSearchedPhaseQuery(location.search) : '',
    300,
  );
  const inputRef = useRef<any>(null);
  const noOfRerender = useRef<number>(0);
  const navigate = useNavigate();

  function setInputValue(value: string) {
    if (inputRef.current) {
      inputRef.current.value = value || '';
    }
  }

  function inputHandler(event: ChangeEvent<HTMLInputElement>) {
    const searchData = event.target.value;
    if (searchData.trim().length === 0) {
      setSearchedPhase('');
    } else if (searchData && searchData.trim().length >= 3) {
      setSearchedPhase(searchData.trim());
    }
  }

  const clearValue = () => {
    setSearchedPhase('');
    setInputValue('');
  };

  useEffect(() => {
    onChange(searchedPhase);
  }, [searchedPhase]);

  // clear searched value
  useEffect(() => {
    setSearchedPhase('');
    setInputValue('');
  }, [clear]);

  // set default value
  useEffect(() => {
    setInputValue(String(defaultValue));
  }, [defaultValue]);

  // pass the searched phase to params
  useEffect(() => {
    if (noOfRerender.current && location.pathname !== routes.events.default.match && !location.pathname.includes('timeline') && location.pathname !== routes.patientList.match) {
      // Retrieve others query and add searchQuery with it 
      const urlSearchQueryList =  queryString.parse(location.search);
      urlSearchQueryList.searchedPhase = searchedPhase;
      navigate(`?${queryString.stringify(urlSearchQueryList)}`, { replace: true });

    }
    noOfRerender.current = noOfRerender.current + 1;
  }, [searchedPhase]);

  // set value from the params
  useEffect(() => {
    setSearchedPhase(getSearchedPhaseQuery(location.search) || '');
    noOfRerender.current = noOfRerender.current + 1;
  }, [location.search]);

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
              {!!(inputRef?.current?.value?.length || defaultValue.length) && (
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
