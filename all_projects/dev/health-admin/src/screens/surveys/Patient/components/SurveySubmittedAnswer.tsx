import { FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields } from 'health-generatedTypes';
import { Slider } from '@mantine/core';
import React from 'react';
import './_surveySubmittedAnswer.scoped.scss';

const pageDefaultColor = '#868e96';

export const barStyles = {
  bar: { backgroundColor: pageDefaultColor },
  thumb: { backgroundColor: '#ffffff', border: `4px solid ${pageDefaultColor}` }, 
  track: { backgroundColor: pageDefaultColor },
  markFilled: { backgroundColor: pageDefaultColor, borderColor: pageDefaultColor },
  mark:{ backgroundColor: pageDefaultColor },
  label:{ lineHeight: 1, top: '-30px', padding: '6px 8px' }
};

export const barStylesDisable = {
  bar: { backgroundColor: 'transparent' },
  thumb: { backgroundColor: 'transparent', border: '4px solid transparent' }, 
  track: { backgroundColor: 'transparent' },
  markFilled: { backgroundColor: 'transparent' },
  mark:{ backgroundColor: 'transparent' }
};

function getOptionsWithValues(item: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields, isSkipped?:boolean) {

  if (item.inputType === 'text' || item.inputType === 'textarea') {
    return (
      <>
        <h1 className={`font-medium text-xsm md:text-xsmd leading-5 md:leading-6 mb-2 ${ isSkipped ? 'text-gray-500' : 'text-gray-900'}`}>{item.label}</h1>
        <div className={`border-1 rounded bg-gray-200 p-2 ${ isSkipped ? 'text-gray-500' : 'text-gray-900'}`}>{item.value || 'N/A'}</div>
      </>
    );
  }

  if (item.inputType === 'date') {
    return (
      <>
        <h1 className={`font-medium text-xsm md:text-xsmd leading-5 md:leading-6 ${isSkipped ? 'text-gray-500' : 'text-gray-900'}`}>{item.label}</h1>
        <input
          className="rounded bg-gray-200 text-gray-650 cursor-not-allowed border-gray-350 w-full md:w-2/5 mt-3"
          type="text"
          disabled
          value={item.value || 'N/A'}
        />
      </>
    );
  }

  if (item.inputType === 'checkbox') {
    const checkboxValue = item?.value?.indexOf(',') ? item?.value.split(',') : item?.value;
    return (
      <>
        <h1 className={`font-medium text-xsm md:text-xsmd leading-5 md:leading-6 ${isSkipped ? 'text-gray-500' : 'text-gray-900'}`}>{item.label}</h1>
        <div className="pdf-to-download-radio-checkbox pt-4">
        {item.options?.map((optionData) => (
          <label key={optionData.id}>
            <input
              disabled
              type="checkbox"
              checked={(typeof checkboxValue === 'string' ) ?  item.value?.trim() === optionData.value?.trim() : checkboxValue?.includes(String(optionData?.value))}
              className="text-gray-600 cursor-not-allowed"
              value={String(optionData.value)}
            />
            <div className={`font-normal text-xsm ${isSkipped ? 'text-gray-500' : 'text-gray-900'}`}> {optionData.label}</div>
          </label>
        ))}
      </div>
      </>
    );
  }

  if (item.inputType === 'radio') {
    
    return (
      <>
        <h1 className={`font-medium text-xsm md:text-xsmd leading-5 md:leading-6 ${isSkipped ? 'text-gray-500' : 'text-gray-900'}`}>{item.label}</h1>
        <div className="pdf-to-download-radio-checkbox pt-4">
        {item.options?.map((optionData) => (
          <label key={optionData.id}>
            <input
              disabled
              type="radio"
              checked={item.value?.trim() === optionData.value?.trim()}
              className="text-gray-600 cursor-not-allowed w-5 h-5"
              value={String(optionData.value)}
            />
            <div className={`font-normal text-xsm ${isSkipped ? 'text-gray-500' : 'text-gray-900'}`}> {optionData.label}</div>
          </label>
        ))}
      </div>
      </>
      
    );
  }

  if (item.inputType === 'dropdown') {
    return (
      <>
        <h1 className={`font-medium text-xsm md:text-xsmd leading-5 md:leading-6 ${isSkipped ? 'text-gray-500' : 'text-gray-900'} mb-4`}>{item.label}</h1>
        <select
          disabled
          className={`rounded bg-gray-200 ${isSkipped ? 'text-gray-500' : 'text-black-900'}  cursor-not-allowed border-gray-350 w-full  md:w-2/5`}>
          <option >{item?.options?.find(o => o?.value === item?.value)?.label || 'N/A'}</option>
        </select>
      </>
      
    );
  }

  if (item.inputType === 'range') {
    const itemValue = item.value ? Number(item.value) : 0;
    const minValue = item.rangeValue ? Number(item.rangeValue.split(',')[0]) : 0;
    const maxValue = item.rangeValue ? Number(item.rangeValue.split(',')[1]) : 100;
    const marks = [
      { value: minValue, label: `${minValue}` },
      { value: maxValue, label: `${maxValue}` },
    ];

    return (
      <div className='slider-wrapper'>
        <h1 className={`font-medium text-xsm md:text-xsmd leading-5 md:leading-6 ${isSkipped ? 'text-gray-500' : 'text-gray-900'}`}>{item.label}</h1>
        <Slider
          marks={marks}
          disabled={isSkipped}
          labelAlwaysOn
          label={itemValue}
          className="w-full my-6 cursor-not-allowed"
          min={minValue}
          max={maxValue}
          value={itemValue}
          styles={isSkipped ? barStylesDisable : barStyles}
        />
      </div>
    );
  }
  return <>{item.value}</>;
}

export default function SurveyValueToLabel({
  item,
  isSkipped
}: {
  item: FacilitySurveyWithAnswer_pretaaHealthGetSurveyWithAnswer_surveyFields;
  isSkipped?: boolean
}) {
  return (
    <div className="flex flex-col p-2">
      {item.inputType !== 'html' && (
        <div
          className={`pdf-label flex flex-col  
        ${item.parentQuestionName !== null && 'pl-6'}
        `}>
          <div className="mt-4 page-breaker">{getOptionsWithValues(item, isSkipped)}</div>
        </div>
      )}

      {item.inputType === 'html' && (
        <div className="bold-text html-label mt-4 md:mt-10 font-medium text-xsm sm:text-xsmd text-gray-900 page-breaker">
          <div
            className="font-sans"
            dangerouslySetInnerHTML={{
              __html: item.label as string,
            }}></div>
        </div>
      )}
    </div>
  );
}
