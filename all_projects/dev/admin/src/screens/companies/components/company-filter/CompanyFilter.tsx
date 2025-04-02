import React, { ReactNode, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import iconFilter from 'assets/icons/icon_filter.svg';
import Button from 'components/ui/button/Button';
import {
  FormFieldsJson,
  DefaultFiltersVariable,
  DefaultIndustriesVariable,
  DefaultProductsVariable,
  SurveyedRangeVariable,
  ManualRangeVariable,
  EmployeesRangeVariable,
  ArrRangeVariable,
  EmployeesVariable,
  ArrVariable,
} from '../../../../interface/company-interface';
import { DateRangeTypes, PretaaGetGlobalIndustriesAndProductAndCompanyFilter } from '../../../../generatedTypes';
import { GetGlobalIndustriesAndProductAndCompanyFilterQuery }
  from '../../../../lib/query/company/get-global-industries-product-comapany-filter';
import { useQuery } from '@apollo/client';
import Select from 'react-select';
import { timeRange, arrRange, employeesRange } from '../../../../lib/constant/timeRange';
import { Collapse } from 'react-collapse';
import downIconGray from '../../../../assets/icons/icon-down-gray.svg';
import { errorList } from '../../../../lib/message.json';
import { cursorStyleSelectInput } from '../../../../components/ui/SelectBox';
import 'rc-slider/assets/index.css';
import './company-filter.scss';
import './company-filter.scoped.scss';
import 'react-datepicker/dist/react-datepicker.css';

const contentStyle = { maxWidth: '65% !important', left: '10% !important' };

const defaultValues = {
  filters: [],
  references: {},
  industries: [],
  products: [],
  npsScore: { min: '', max: '' },
  employeeCount: { min: null, max: null },
  arr: { min: null, max: null },
};

const defaultReferenceData = {
  surveyed: false,
  surveyedRange: '',
  manual: false,
  manualRange: '',
  referredOn: false,
  offeredOn: false,
  allReference: false,
};

const defaultManualRange = { label: 'All', value: DateRangeTypes.ALL };
const defaultSurveyedRange = { label: 'All', value: DateRangeTypes.ALL };
const defaultArrRange = { label: 'All', value: 'All' };
const defaultEmployeesRange = { label: 'All', value: 'All' };

export default function CompanyFilter({
  onChange,
  selectedOptions,
  defaultFilters,
  setDefaultFilters,
  defaultProducts,
  setDefaultProducts,
  defaultIndustries,
  setDefaultIndustries,
  isQueryUpdate,
}: {
  selectedOptions: FormFieldsJson;
  onChange?: (options: FormFieldsJson) => void;
  trigger?: ReactNode;
  defaultFilters: DefaultFiltersVariable[];
  setDefaultFilters: (defaultFilters: DefaultFiltersVariable[]) => void;
  defaultProducts: DefaultProductsVariable[];
  setDefaultProducts: (defaultProducts: DefaultProductsVariable[]) => void;
  defaultIndustries: DefaultIndustriesVariable[];
  setDefaultIndustries: (defaultIndustries: DefaultIndustriesVariable[]) => void;
  isQueryUpdate: boolean;
}): JSX.Element {
  const { data: globalIndustriesAndProductAndCompanyFilter, loading: industriesLoading } =
    useQuery<PretaaGetGlobalIndustriesAndProductAndCompanyFilter>(GetGlobalIndustriesAndProductAndCompanyFilterQuery);

  const [open, setOpen] = useState(false);
  const [filterObj, setFilterObj] = useState<any>(defaultValues);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [npsError, setNpsError] = useState('');
  const [referenceData, setReferenceData] = useState(defaultReferenceData);
  const [manualRange, setManualRange] = useState<ManualRangeVariable>(defaultManualRange);
  const [surveyedRange, setSurveyedRange] = useState<SurveyedRangeVariable>(defaultSurveyedRange);
  const [selectArrRange, setSelectArrRange] = useState<ArrRangeVariable>(defaultArrRange);
  const [selectEmployeesRange, setSelectEmployeesRange] = useState<EmployeesRangeVariable>(defaultEmployeesRange);

  useEffect(() => {
    if (
      (open || isQueryUpdate) &&
      globalIndustriesAndProductAndCompanyFilter?.pretaaGetCompanyFilterParams &&
      Object.keys(globalIndustriesAndProductAndCompanyFilter?.pretaaGetCompanyFilterParams).length > 0 &&
      Array.isArray(globalIndustriesAndProductAndCompanyFilter?.pretaaCompanyProducts) &&
      Array.isArray(globalIndustriesAndProductAndCompanyFilter?.pretaaGetGlobalIndustries)
    ) {
      const filterData: DefaultFiltersVariable[] = [];
      Object.keys(globalIndustriesAndProductAndCompanyFilter?.pretaaGetCompanyFilterParams)?.forEach((key: string) => {
        filterData.push({ name: key, isChecked: false });
      });
      const defaultGlobalIndustry: DefaultIndustriesVariable[] =
        globalIndustriesAndProductAndCompanyFilter?.pretaaGetGlobalIndustries?.map((item) => ({
          ...item,
          isChecked: false,
        })) || [];

      const defaultCompanyProduct =
        globalIndustriesAndProductAndCompanyFilter?.pretaaCompanyProducts?.map((item) => ({
          ...item,
          isChecked: false,
        })) || [];
      const selectedOptionsData: any = selectedOptions;
      if (Object.keys(selectedOptionsData)?.length > 0 && defaultValues !== selectedOptionsData) {
        setFilterObj({
          ...defaultValues,
          ...selectedOptionsData,
        });
        filterData.forEach((item) => {
          if (selectedOptionsData?.filters?.includes(item.name)) {
            item.isChecked = true;
          }
        });
        defaultGlobalIndustry.forEach((item) => {
          item.isChecked = true;
        });
        defaultCompanyProduct.forEach((item) => {
          item.isChecked = true;
        });
        if (selectedOptionsData?.references && open) {
          setReferenceData({
            ...referenceData,
            ...selectedOptionsData?.references,
          });
          if (selectedOptionsData?.references?.surveyedRange) {
            const selectedSurveyedRange =
              timeRange.find(
                (item: { value: string }) => item.value === selectedOptionsData?.references?.surveyedRange
              ) || defaultSurveyedRange;
            setSurveyedRange(selectedSurveyedRange);
          }
          if (selectedOptionsData?.references?.manualRange) {
            const selectedManualRange =
              timeRange.find(
                (item: { value: string }) => item.value === selectedOptionsData?.references?.manualRange
              ) || defaultManualRange;
            setManualRange(selectedManualRange);
          }
        }
        setDefaultIndustries(defaultGlobalIndustry);
        setDefaultProducts(defaultCompanyProduct);
        setDefaultFilters(filterData);
      } else {
        setDefaultFilters(filterData);
        setDefaultIndustries(defaultGlobalIndustry);
        setDefaultProducts(defaultCompanyProduct);
        setFilterObj(defaultValues);
      }
      if (selectedOptionsData?.arr) {
        // for selected arr showing in modal
        const arr =
          arrRange?.find(
            (item) =>
              item.value?.[0] === selectedOptionsData?.arr?.min && item.value?.[1] === selectedOptionsData?.arr?.max
          ) || defaultArrRange;
        setSelectArrRange(arr);
      } else {
        setSelectArrRange(defaultArrRange); //remove selected value
      }
      if (selectedOptionsData?.employeeCount) {
        const employees = employeesRange?.find(item =>
          (item.value?.[0] === selectedOptionsData?.employeeCount?.min) &&
            (item.value?.[1] === selectedOptionsData?.employeeCount?.max))
              || defaultEmployeesRange;
        setSelectEmployeesRange(employees);
      } else {
        setSelectEmployeesRange(defaultEmployeesRange);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isQueryUpdate, industriesLoading]);

  const clearReferenceFilter = () => {
    setReferenceData({ ...defaultReferenceData });
    setSurveyedRange(defaultSurveyedRange);
    setManualRange(defaultManualRange);
  };

  const closeModal = () => {
    setOpen(false);
    clearReferenceFilter();
  };

  const onSubmit = () => {
    if (filterObj?.npsScore?.min || filterObj?.npsScore?.max) {
      if (
        !filterObj?.npsScore?.min ||
        Number(filterObj?.npsScore?.min) < 0 ||
        !filterObj?.npsScore?.max ||
        Number(filterObj?.npsScore?.max) > 10 ||
        isNaN(filterObj?.npsScore?.min) ||
        isNaN(filterObj?.npsScore?.max)
      ) {
        setNpsError(errorList.npsErrorBetween);
        return;
      } else if (Number(filterObj?.npsScore?.min) > Number(filterObj?.npsScore?.max)) {
        setNpsError(errorList.npsErrorMinMax);
        return;
      }
    }
    referenceData.surveyedRange = surveyedRange?.value;
    referenceData.manualRange = manualRange?.value;
    referenceData.allReference = false;
    if (!(referenceData?.offeredOn || referenceData?.referredOn) || manualRange?.value === DateRangeTypes.ALL) {
      referenceData.manualRange = '';
    }
    if (!referenceData?.surveyed || surveyedRange?.value === DateRangeTypes.ALL) {
      referenceData.surveyedRange = '';
    }
    referenceData.manual = false;
    let arr: ArrVariable = defaultValues.arr;
    let employees: EmployeesVariable = defaultValues.employeeCount;
    if (selectArrRange?.value && selectArrRange?.value !== 'All') {
      if (selectArrRange?.value?.[1] === 500001) {
        arr = {
          min: Number(selectArrRange?.value?.[1]),
          max: null,
        };
      } else {
        arr = {
          min: Number(selectArrRange?.value?.[0]),
          max: Number(selectArrRange?.value?.[1]),
        };
      }
    }
    if (selectEmployeesRange?.value && selectEmployeesRange?.value !== 'All') {
      employees = {
        min: Number(selectEmployeesRange?.value?.[0]),
        max: Number(selectEmployeesRange?.value?.[1]),
      };
    }
    const filterData: FormFieldsJson = {
      filters: filterObj?.filters,
      industries: filterObj?.industries,
      products: filterObj?.products,
      npsScore: filterObj?.npsScore,
      employeeCount: employees,
      arr: arr,
      references: referenceData,
    };
    if (onChange) {
      onChange(filterData);
    }
    setOpen(false);
    setNpsError('');
    clearReferenceFilter();
  };

  const allReference = (value: boolean, checkIsAll: boolean) => {
    return !!(value && checkIsAll);
  };

  const allReferenceAndManual = (value: boolean, checkManual: boolean, checkIsAll: boolean) => {
    return value && checkManual && checkIsAll;
  };

  const handleChange = (itemValue: string | boolean, value: string | any, type: string) => {
    if (type === 'filters') {
      if (itemValue) {
        const updatedFilters = [...filterObj?.filters, value];
        setFilterObj({
          ...filterObj,
          filters: updatedFilters,
        });
      } else {
        const index = filterObj?.filters.indexOf(value);
        const remainingFilters = filterObj?.filters.filter((item: string, i: number) => i !== index);
        setFilterObj({
          ...filterObj,
          filters: remainingFilters,
        });
      }
      defaultFilters?.forEach((item) => {
        if (item.name === value) {
          if (typeof itemValue === 'boolean') {
            item.isChecked = itemValue;
          }
        }
      });
      setDefaultFilters(defaultFilters);
    } else if (type === 'npsScore') {
      if (typeof itemValue !== 'boolean') {
        const npsScoreValue = itemValue.replace(/[^0-9-]/g, '');
        setFilterObj({
          ...filterObj,
          npsScore: { ...filterObj?.npsScore, [value]: npsScoreValue || '' },
        });
      }
    } else if (type === 'industries') {
      if (itemValue) {
        const updateIndustry = [...filterObj?.industries, value];
        setFilterObj({
          ...filterObj,
          industries: updateIndustry,
        });
      } else {
        const index = filterObj?.industries.indexOf(value);
        filterObj?.industries.splice(index, 1);
        setFilterObj({
          ...filterObj,
          industries: filterObj?.industries,
        });
      }
      defaultIndustries?.forEach((item) => {
        if (item.id === value) {
          if (typeof itemValue === 'boolean') {
            item.isChecked = itemValue;
          }
        }
      });
    } else if (type === 'products') {
      if (itemValue) {
        const updateProducts = [...filterObj?.products, value];
        setFilterObj({
          ...filterObj,
          products: updateProducts,
        });
      } else {
        const index = filterObj?.products.indexOf(value);
        filterObj?.products.splice(index, 1);
        setFilterObj({
          ...filterObj,
          products: filterObj?.products,
        });
      }
      defaultProducts?.forEach((item) => {
        if (item?.customerProductId === value) {
          if (typeof itemValue === 'boolean') {
            item.isChecked = itemValue;
          }
        }
      });
    } else if (type === 'references' && typeof itemValue === 'boolean') {
      if (value === 'allReference') {
        setReferenceData({
          ...referenceData, // all checked and unchecked
          surveyed: itemValue,
          manual: itemValue,
          referredOn: itemValue,
          offeredOn: itemValue,
          allReference: itemValue,
        });
      } else if (value === 'manual') {
        setReferenceData({
          ...referenceData,
          allReference: allReference(itemValue, referenceData?.surveyed),
          manual: itemValue,
          referredOn: itemValue,
          offeredOn: itemValue,
        });
      } else if (value === 'surveyed') {
        setReferenceData({
          ...referenceData,
          surveyed: itemValue,
          allReference: allReference(itemValue, referenceData?.manual),
        });
      } else if (value === 'referredOn') {
        setReferenceData({
          ...referenceData,
          referredOn: itemValue,
          allReference: allReferenceAndManual(itemValue, referenceData?.surveyed, referenceData?.offeredOn),
          manual: allReferenceAndManual(itemValue, referenceData?.surveyed, referenceData?.offeredOn),
        });
      } else if (value === 'offeredOn') {
        setReferenceData({
          ...referenceData,
          offeredOn: itemValue,
          allReference: allReferenceAndManual(itemValue, referenceData?.surveyed, referenceData?.referredOn),
          manual: allReferenceAndManual(itemValue, referenceData?.surveyed, referenceData?.referredOn),
        });
      }
    } else if (type === 'manualRange') {
      setManualRange(value);
    } else if (type === 'surveyedRange') {
      setSurveyedRange(value);
    } else if (type === 'arr') {
      setSelectArrRange(value);
    } else if (type === 'employees') {
      setSelectEmployeesRange(value);
    }
  };

  const clearAll = () => {
    setDefaultFilters(
      defaultFilters?.map((item) => ({
        ...item,
        isChecked: false,
      }))
    );
    setDefaultProducts(
      defaultProducts?.map((item) => ({
        ...item,
        isChecked: false,
      }))
    );
    setDefaultIndustries(
      defaultIndustries?.map((item) => ({
        ...item,
        isChecked: false,
      }))
    );
    setNpsError('');
    setReferenceData(defaultReferenceData);
    setManualRange(defaultManualRange);
    setSurveyedRange(defaultSurveyedRange);
    setFilterObj(defaultValues);
    setSelectArrRange(defaultArrRange);
    setSelectEmployeesRange(defaultEmployeesRange);
  };

  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} data-test-id="company-filter">
        <img src={iconFilter} alt="filter" />
      </button>
      {open && (
        <Popup
          open={open}
          closeOnDocumentClick
          onClose={closeModal}
          className="company-filter-modal"
          {...{ contentStyle }}>
          <div className="modal p-0 ">
            <div
              className="flex justify-between items-center
              company-filter-heading">
              <h1 className="h1 font-bold text-primary ml-8">Filter</h1>
              <Button
                text="Cancel"
                type="button"
                onClick={closeModal}
                style="other"
                classes="text-primary-light fw-500 outline-none"
              />
            </div>
            <div>
              <div className="mt-4 mb-3 ml-5">
                <p className="clearall ml-3 cursor-pointer" onClick={clearAll}>
                  Clear All
                </p>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full
              filterDiv pt-3">
                <div className="space-y-4 px-8 md:pr-6">
                  <div className="space-y-3">
                    {defaultFilters?.map((item: DefaultFiltersVariable, index: number) => {
                      return (
                        <div className="border-b pb-3" key={index}>
                          <label data-testid="option" className="flex items-center space-x-3 uppercase cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item?.isChecked}
                              onChange={(e) => handleChange(e.target.checked, item?.name, 'filters')}
                              className={`appearance-none h-5 w-5 border
                        border-primary-light cursor-pointer
                        checked:bg-primary-light checked:border-transparent
                        rounded-md form-tick`}
                            />
                            <span className="text-primary font-semibold filterlabel text-base">
                              {item?.name?.replace('_', ' ')}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-b pb-4">
                    <div
                      className="cursor-pointer flex justify-between"
                      onClick={() => setReferenceOpen(!referenceOpen)}>
                      <div className="fw-500">Reference</div>
                      <img src={downIconGray} alt="down-icon" className={`${referenceOpen && 'rotate180'}`} />
                    </div>
                    <Collapse isOpened={referenceOpen}>
                      <div className="mt-3.5">
                        <label data-testid="option" className="cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              referenceData?.allReference ||
                              (referenceData?.referredOn &&
                                referenceData?.offeredOn &&
                                referenceData?.referredOn &&
                                referenceData?.offeredOn &&
                                referenceData?.surveyed)
                            }
                            onChange={(e) => handleChange(e.target.checked, 'allReference', 'references')}
                            className={`appearance-none h-5 w-5 border
                          border-primary-light cursor-pointer
                          checked:bg-primary-light checked:border-transparent
                          rounded-md form-tick`}
                          />
                          <span
                            className="text-primary font-semibold filterlabel
                            text-base ml-2.5">
                            Reference
                          </span>
                        </label>
                      </div>
                      <div className="mt-4 ml-5">
                        <label data-testid="option" className="cursor-pointer">
                          <input
                            type="checkbox"
                            checked={referenceData?.manual || (referenceData?.referredOn && referenceData?.offeredOn)}
                            onChange={(e) => handleChange(e.target.checked, 'manual', 'references')}
                            className={`appearance-none h-5 w-5 border
                            border-primary-light cursor-pointer
                            checked:bg-primary-light checked:border-transparent
                            rounded-md form-tick`}
                          />
                          <span
                            className="text-primary font-semibold filterlabel
                            text-base ml-3">
                            Manual
                          </span>
                        </label>
                      </div>
                      <div className="mt-5 ml-52">
                        <div className="d-flex justify-content-between align-item-center">
                          <span
                            className="text-primary font-semibold filterlabel
                      text-base">
                            Date Range
                          </span>
                          <div className="select-wrapper">
                            <Select
                              className={'basic-single mw-105'}
                              isSearchable={false}
                              styles={cursorStyleSelectInput}
                              onChange={(value) => handleChange('', value, 'manualRange')}
                              options={timeRange}
                              value={manualRange}
                              name="selectrole"
                              id="selectrole"
                              placeholder="All"
                              components={{
                                IndicatorSeparator: () => null,
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label data-testid="option" className='cursor-pointer'>
                            <input
                              type="checkbox"
                              checked={referenceData?.referredOn}
                              onChange={(e) => handleChange(e.target.checked, 'referredOn', 'references')}
                              className={`appearance-none h-5 w-5 border
                              border-primary-light cursor-pointer
                              checked:bg-primary-light checked:border-transparent
                              rounded-md form-tick`}
                            />
                            <span
                              className="text-primary font-semibold filterlabel
                              text-base ml-2">
                              Has served
                            </span>
                          </label>
                        </div>
                        <div className="mt-5">
                          <label data-testid="option" className='cursor-pointer'>
                            <input
                              type="checkbox"
                              checked={referenceData?.offeredOn}
                              onChange={(e) => handleChange(e.target.checked, 'offeredOn', 'references')}
                              className={`appearance-none h-5 w-5 border
                              border-primary-light cursor-pointer
                              checked:bg-primary-light checked:border-transparent
                              rounded-md form-tick`}
                            />
                            <span
                              className="text-primary font-semibold filterlabel
                            text-base ml-2">
                              Have offered
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="mt-5 ml-5">
                        <label data-testid="option" className='cursor-pointer'>
                          <input
                            type="checkbox"
                            checked={referenceData?.surveyed}
                            onChange={(e) => handleChange(e.target.checked, 'surveyed', 'references')}
                            className={`appearance-none h-5 w-5 border border-primary-light cursor-pointer
                            checked:bg-primary-light checked:border-transparent rounded-md form-tick`}
                          />
                          <span className="text-primary font-semibold filterlabel text-base ml-3">Surveyed</span>
                        </label>
                      </div>
                      <div className="ml-52 mt-4.5">
                        <div className="d-flex justify-content-between align-item-center">
                          <span
                            className="text-primary font-semibold filterlabel
                      text-base">
                            Date Range
                          </span>
                          <div className="select-wrapper">
                            <Select
                              className={'basic-single mw-105'}
                              isSearchable={false}
                              styles={cursorStyleSelectInput}
                              options={timeRange}
                              onChange={(value) => handleChange('', value, 'surveyedRange')}
                              value={surveyedRange}
                              name="selectrole"
                              id="selectrole"
                              placeholder="All"
                              components={{
                                IndicatorSeparator: () => null,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                  <div className="border-gray-300 border-b pt-2 pb-2 d-flex justify-content-between items-center mt-0">
                    <div className="fw-500">Average NPS Response</div>
                    <div className="d-flex items-center">
                      <input
                        type="text"
                        className="text-black text-right
                          border-gray-300 rounded-lg w-70"
                        placeholder="0"
                        value={filterObj?.npsScore?.min}
                        onChange={(e) => handleChange(e.target.value, 'min', 'npsScore')}
                      />
                      <span className="ml-4 text-gray-09 opacity-03">to</span>
                      <input
                        type="text"
                        className="text-black text-right
                          border-gray-300 rounded-lg w-70 ml-4"
                        placeholder="10"
                        value={filterObj?.npsScore?.max}
                        onChange={(e) => handleChange(e.target.value, 'max', 'npsScore')}
                      />
                    </div>
                  </div>
                  <span className="nps-error">{npsError || ''}</span>
                  <div className="border-gray-300 border-b pb-4">
                    <div
                      className="flex justify-between cursor-pointer"
                      onClick={() => setIndustriesOpen(!industriesOpen)}>
                      <div className="fw-500">Industry</div>
                      <img src={downIconGray} alt="down-icon" className={`${industriesOpen && 'rotate180'}`} />
                    </div>
                  </div>
                  <Collapse isOpened={industriesOpen}>
                    {defaultIndustries.map((item: DefaultIndustriesVariable, index: number) => {
                      return (
                        <div className="border-b pb-3 pt-3" key={index}>
                          <label data-testid="option" className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              value="ff"
                              className={`appearance-none h-5 w-5 border
                                  border-primary-light cursor-pointer
                                  checked:bg-primary-light checked:border-transparent
                                  rounded-md form-tick`}
                              checked={item?.isChecked}
                              onChange={(e) => handleChange(e.target.checked, item?.id, 'industries')}
                            />
                            <span className="text-primary font-semibold filterlabel text-base">{item?.sector}</span>
                          </label>
                        </div>
                      );
                    })}
                  </Collapse>
                </div>
                <div className="px-8 md:pl-0 md:pr-14 space-y-2">
                  <div className="border-b border-gray-300">
                    <div className="d-flex justify-content-between align-item-center mb-2">
                      <div className="fw-500 text-black">Revenue</div>
                      <div className="select-wrapper">
                        <Select
                          className={'basic-single mw-166'}
                          isSearchable={false}
                          styles={cursorStyleSelectInput}
                          onChange={(value) => handleChange('', value, 'arr')}
                          options={arrRange}
                          value={selectArrRange}
                          name="selectrole"
                          id="arr-range"
                          placeholder="All"
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-gray-300">
                    <div className="d-flex justify-content-between align-item-center mb-2">
                      <div className="fw-500 text-black">Employees</div>
                      <div className="select-wrapper">
                        <Select
                          className={'basic-single mw-166'}
                          isSearchable={false}
                          styles={cursorStyleSelectInput}
                          onChange={(value) => handleChange('', value, 'employees')}
                          options={employeesRange}
                          value={selectEmployeesRange}
                          id="employees-range"
                          placeholder="All"
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-gray-300 pb-3">
                    <div className="flex justify-between cursor-pointer " onClick={() => setProductOpen(!productOpen)}>
                      <div className="fw-500">Product</div>
                      <img src={downIconGray} alt="down-icon" className={`${productOpen && 'rotate180'}`} />
                    </div>
                  </div>
                  <Collapse isOpened={productOpen}>
                    {defaultProducts.map((item: DefaultProductsVariable, index: number) => {
                      return (
                        <div className="border-b pb-3 pt-3" key={index}>
                          <label data-testid="option" className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              value="ff"
                              className={`appearance-none h-5 w-5 border
                                  border-primary-light cursor-pointer
                                  checked:bg-primary-light checked:border-transparent
                                  rounded-md form-tick`}
                              checked={item?.isChecked || false}
                              onChange={(e) => handleChange(e.target.checked, item?.customerProductId, 'products')}
                            />
                            <span className="text-primary filterlabel text-base">{item?.name}</span>
                          </label>
                        </div>
                      );
                    })}
                  </Collapse>
                </div>
              </div>
              <div className="flex mb-4 lg:mb-8 w-full justify-center items-center px-5 lg:px-8">
                <Button onClick={onSubmit}>Filter</Button>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
