import React, { useEffect, useRef, useState } from 'react';
import caretDown from '../../../assets/icons/icon-filled-down.svg';
import { SelectBox } from 'interface/SelectBox.interface';
import './_appDropDown.scoped.scss';
import CloseIcon from 'components/icons/CloseIcon';

export enum AppActionMetaInterface {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

enum Placeholder {
  LOADING = 'Loading... ',
  SELECT = 'Select ...',
  ALL_SELECTED = 'All options selected',
}

export enum AppDropdownAllOption {
  ALL = 'all',
}

function getPlaceholder(placeholder?: string, loading?: boolean) {
  if (loading) {
    return Placeholder.LOADING;
  }
  if (placeholder) {
    return placeholder;
  }
  return Placeholder.SELECT;
}
type SelectBoxValue = SelectBox | SelectBox[] | null;

function getValue(options: SelectBox[], value?: SelectBoxValue) {
  if (!value) {
    return '';
  }
  if (!Array.isArray(value)) {
    return value?.label.replaceAll('_', ' ').toLowerCase();
  }

  if (
    options.filter((f) => f.value !== AppDropdownAllOption.ALL).length ===
    value.filter((f) => f.value !== AppDropdownAllOption.ALL).length
  ) {
    return Placeholder.ALL_SELECTED;
  }
  const label = value[0]?.label?.replaceAll('_', ' ')?.toLowerCase();

  const displayLabel = value.length > 1 ? label.substring(0, 5) : label;
  const ellipsis = value.length > 1 && label.length > 5 ? '...' : '';
  const selectedCount = value.length > 1 ? ' + ' + (value.length - 1) + ' selected ' : '';
  return value.length
    ? `${displayLabel} ${ellipsis} ${selectedCount}`
    : Placeholder.SELECT;
}

function isOptionSelected(currentValue: SelectBox, selectedValue?: SelectBox | SelectBox[] | null) {
  if (!selectedValue) {
    return false;
  }
  if (!Array.isArray(selectedValue)) {
    return selectedValue.value === currentValue?.value;
  }
  return !!selectedValue.find((d) => d.value === currentValue.value);
}

export default function AppDropDown({
  className,
  loading,
  options,
  placeholder,
  onChange,
  value,
  closeMenuOnSelect = true,
  onApply,
  dropDownClassName,
  showCheckBox = true,
  searchable = true,
  showBadge,
  disableMenu = false
}: {
  className?: string;
  loading?: boolean;
  options: SelectBox[];
  placeholder?: string;
  onChange: (
    data: SelectBox | null,
    eventType: 'badgeRemove' | 'dropDownEvent',
    isMenuOpened: boolean,
    allUnChecked?: boolean,
  ) => void;
  value?: SelectBox | SelectBox[] | null;
  closeMenuOnSelect?: boolean;
  onApply?: (selectedOptions: SelectBox[]) => void;
  dropDownClassName?: string;
  showCheckBox?: boolean;
  searchable?: boolean;
  showBadge?: {
    badge: boolean;
    closeBtn: boolean;
  };
  disableMenu?: boolean;
}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [placeHolder, setPlaceHolder] = useState<string | null>(() => getPlaceholder(placeholder, loading));
  const [dropDownOptions, setDropDownOptions] = useState<SelectBox[]>([]);

  const badgeInputRef = useRef<HTMLInputElement | null>(null);
  const render = useRef(0);

  function showBadgeSearchField(show: boolean) {
    if (!badgeInputRef.current) {
      return;
    }
    if (show) {
      badgeInputRef.current.style.height = '2.5rem';
      badgeInputRef.current.focus();
    } else {
      badgeInputRef.current.style.height = '0rem';
    }
  }

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsDropDownOpen(false);
        if (Array.isArray(value) ? !!value.length : !!value?.value) {
          showBadgeSearchField(false);
        }
      }
    };
    document.addEventListener('click', checkIfClickedOutside);
    return () => {
      document.removeEventListener('click', checkIfClickedOutside);
    };
  }, [value]);

  useEffect(() => {
    setDropDownOptions(options);
  }, [options]);

  useEffect(() => {
    if (!showBadge?.badge) {
      setInputValue(getValue(options, value));
    }
  }, [options, value]);

  useEffect(() => {
    render.current++;
    if (render.current > 2 && Array.isArray(value) && !value.length) {
      showBadgeSearchField(true);
    }
  }, [value]);

  return (
    <div
      className={`w-full ${className} ${showBadge?.badge ? 'h-28 ' : 'h-10'} relative`}
      ref={modalRef}>
      <div className="absolute w-full filter-border bg-white flex flex-col rounded-lg  ">
        <div
          className={`flex ${
            isDropDownOpen && 'filter-border-b'
          } ${!disableMenu && 'cursor-pointer'} py-0.5 flex-row justify-between px-1 text-gray-800`}
          onClick={() => {
            if (!disableMenu) {
              showBadgeSearchField(!isDropDownOpen);
              setIsDropDownOpen(!isDropDownOpen);
            }
          }}
          >
          <div className="flex justify-between items-center mr-1 w-10/12">
            {!showBadge?.badge && (
              <input
                type="text"
                className={`app-drop-down-field  text-over-flow-ellipsis cursor-pointer w-full focus:outline-none focus:ring-0  focus:border-transparent placeholder-pt-primary placeholder-opacity-50 ${
                  searchable ? '' : 'hide-cursor'
                }`}
                placeholder={placeHolder ?? undefined}
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                value={inputValue}
                onChange={(e) => {
                  if (!isDropDownOpen) {
                    setIsDropDownOpen(true);
                  }
                  if (!searchable) {
                    return;
                  }
                  const searchedText = e.target.value;
                  if (
                    !searchedText.length &&
                    ((Array.isArray(value) && !!value.length) || (value as SelectBox)?.value)
                  ) {
                    setInputValue('');
                    setPlaceHolder(getValue(options, value));
                  } else {
                    setInputValue(searchedText);
                  }

                  setDropDownOptions(
                    options.filter((option) =>
                      option.label.toLowerCase().includes(e.target.value.trim().toLowerCase()),
                    ),
                  );
                }}
                onFocus={() => {
                  setPlaceHolder(inputValue);
                  setDropDownOptions(options);
                  if (searchable) {
                    setInputValue('');
                  }
                }}
                onBlur={() => searchable && setInputValue(getValue(options, value))}
              />
            )}

            {showBadge?.badge && Array.isArray(value) && (
              <div
                className="flex  mr-1 flex-row flex-wrap px-1.5 overflow-y-auto max-h-28 "
                onClick={() => {
                  if (!disableMenu) {
                    showBadgeSearchField(true);
                  }
                }}
                onBlur={() => {}}>
                {value
                  ?.filter((f) => f.value.toLowerCase() !== AppDropdownAllOption.ALL)
                  .map((selected) => (
                    <div
                      className="capitalize flex space-x-2 mr-2 my-1 items-center font-bold text-xxs rounded-sm bg-gray-100 px-3 py-2 "
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      key={selected.value}>
                      <span>{selected.label}</span>
                      {showBadge?.closeBtn && (
                        <button
                          className="p-2"
                          onClick={(e) => {
                            onChange(selected, 'badgeRemove', isDropDownOpen);
                          }}>
                          <CloseIcon className=" w-3 h-3 bg-gray-200 rounded-full cursor-pointer" />
                        </button>
                      )}
                    </div>
                  ))}
                <input
                  ref={badgeInputRef}
                  type="text"
                  className={`app-drop-down-field h-0 w-fit p-0 text-sm text-over-flow-ellipsis cursor-pointer focus:outline-none focus:ring-0  focus:border-transparent placeholder-pt-primary placeholder-opacity-50 ${
                    searchable ? '' : 'hide-cursor'
                  }`}
                  value={inputValue}
                  onChange={(e) => {
                    if (!isDropDownOpen) {
                      setIsDropDownOpen(true);
                    }
                    if (!searchable) {
                      return;
                    }
                    const searchedText = e.target.value;
                    setInputValue(searchedText);
                    setDropDownOptions(
                      options.filter((option) =>
                        option.label.toLowerCase().includes(e.target.value.trim().toLowerCase()),
                      ),
                    );
                  }}
                  onFocus={() => {
                    if (searchable) {
                      setDropDownOptions(options);
                    }
                  }}
                />
              </div>
            )}
            {showBadge?.closeBtn && Array.isArray(value) && !!value.length && (
              <button
                onClick={() => {
                  onChange(null, 'badgeRemove', isDropDownOpen, true);
                  if (searchable) {
                    setInputValue('');
                  }
                  if (showBadge?.badge) {
                    showBadgeSearchField(true);
                  }
                }}>
                <CloseIcon className=" w-5 h-5 bg-gray-200 p-1 rounded-full cursor-pointer" />
              </button>
            )}
          </div>
          {!disableMenu && <img src={caretDown} className=" w-8 p-1" />}
        </div>

        {isDropDownOpen && (
          <>
            <div
              className={`flex app-drop-down  flex-col bg-white -left-0 -right-2  overflow-auto w-full ${dropDownClassName}`}>
              {loading && <div className="p-2 text-center font-light text-gray-150 text-sm">{Placeholder.LOADING}</div>}

              {!loading && !dropDownOptions.length && (
                <div className="p-2 text-center font-light text-gray-150 text-sm">No Options</div>
              )}

              {!loading &&
                dropDownOptions.map((d) => {
                  const isChecked = isOptionSelected(d, value);
                  return (
                    <div
                      onClick={(e) => {
                        if (closeMenuOnSelect) {
                          setIsDropDownOpen(false);
                        }
                        onChange(d, 'dropDownEvent', isDropDownOpen);
                      }}
                      key={d.value}
                      className={`flex
                     hover:bg-gray-400 hover:text-gray-150 cursor-pointer text-primary font-semibold w-full py-3 items-center space-x-3 capitalize px-3 border-b last:border-0 rounded-none ${
                       isChecked ? 'bg-gray-300' : ''
                     }`}>
                      {showCheckBox && (
                        <input
                          type="checkbox"
                          onChange={() => {}}
                          checked={isChecked}
                          className="appearance-none h-5 w-5 border
                                    border-primary-light
                                    checked:bg-primary-light checked:border-transparent cursor-pointer
                                    rounded-md form-tick"
                        />
                      )}
                      <label className=" cursor-pointer">{d.label}</label>
                    </div>
                  );
                })}
            </div>
            {onApply && (
              <div
                className="bg-yellow-600 text-black p-2 cursor-pointer text-center"
                style={{ borderRadius: '0 0  5px 5px' }}
                onClick={() => onApply(Array.isArray(value) ? value : [])}>
                Apply
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
