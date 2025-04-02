import React, { useEffect, useState } from 'react';
import './_range-slider.scoped.scss';
import './_health-report.scoped.scss';
import { RangeSliderInterface } from 'interface/report.interface';

export interface BoundInterface {
  valueA?: number | null;
  valueB?: number | null;
}

export default function RangeSlider({ rangeData }: { rangeData: RangeSliderInterface }) {
  const [defaultAnomaly, setDefaultAnomaly] = useState<string>('');
  const [noDataCheck, setNoDataCheck] = useState<BoundInterface>({ valueA: 0, valueB: 0 });

  useEffect(() => {
    if ((rangeData.lowerBound || rangeData.lowerBound === 0) && rangeData?.value && rangeData.lowerBound > rangeData?.value) {
      setDefaultAnomaly('less');
    } else if ((rangeData.upperBound || rangeData.upperBound === 0) && rangeData?.value && rangeData.upperBound < rangeData.value) {
      setDefaultAnomaly('more');
    } else { 
      setDefaultAnomaly('');
    }
  }, [rangeData.lowerBound, rangeData.upperBound, rangeData.value]);

  useEffect(() => {
    if (rangeData.value === null || rangeData.value === undefined) {
      setNoDataCheck({
        valueA: 0,
        valueB: 0
      });
    }
    setNoDataCheck({
      valueA: rangeData.lowerBound,
      valueB: rangeData.upperBound
    });
  }, [rangeData.lowerBound, rangeData.upperBound, rangeData.value]);

  function upperBoundData() {
    const { maxRange, rangeUnit, value } = rangeData;
    if (value !== null) {
      if (!!rangeUnit) {
        return `${maxRange + rangeUnit}`;
      }
      return `${maxRange}`;
    }
    return '';
  }

  function lowerBoundData() {
    const { minRange, value } = rangeData;
    if (value !== null) {
      return `${minRange}`;
    }
    return '';
  }

  function renderFirstInputValue() {
    const { lowerBound, minRange, rangeUnit, upperBound } = rangeData;

   if ((upperBound !== lowerBound) && lowerBound && (lowerBound !== minRange)) {
      if (rangeUnit) {
        return (<output className='whitespace-nowrap' first-input-value={lowerBound + rangeUnit}></output>);
      }
      return (<output className='whitespace-nowrap' first-input-value={lowerBound}></output>);
    }
    return null;
  }


  function renderSecondInputValue() {
    const { upperBound, rangeUnit, maxRange, minRange, lowerBound } = rangeData;

   if ((upperBound !== lowerBound) && upperBound && (upperBound !== maxRange) && (upperBound !== minRange)) {
      if (rangeUnit) {
        return (<output className='whitespace-nowrap' second-input-value={upperBound + rangeUnit}></output>);
      }
      return (<output className='whitespace-nowrap' second-input-value={upperBound}></output>);
    }
    return null;
  }

  return (
    <React.Fragment>
      <div className={`pb-6 flex justify-between items-center range-slider-area ${rangeData.isAnomaly ? 'anomaly' : ''}`}>
        <div className="flex mb-8 sm:mb-0 justify-start items-center">
          <div className="icon-wrap">
            <img 
              src={ rangeData.isAnomaly ? rangeData.warningIcon : rangeData.sliderIcon}
              alt="Heart Icon"
              className="supporter-image-icon"
            />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold leading-3 text-black heading-size capitalize">
              {rangeData.sliderLabel ?? 'N/A'}
            </h3>
            <span className="text-xs leading-3 text-black inline-block mt-2 sm:mt-3 lg:mt-2  tracking-wider">
              {rangeData.sliderUnit ?? 'N/A'}
            </span>
          </div>
        </div>

        <div className={`range-area text-center ${rangeData?.value === null ? 'no-data' : ''}`}>
          <div className="text-center capitalize no-data-content">{rangeData?.value === null ? 'No data available' : ''}</div>

            <div className='inline-block text-xss sm:pr-2 md:pr-4 lg:pr-2 xl:pr-4 sm:w-5 md:w-10 text-right whitespace-nowrap'>{lowerBoundData()}</div>

            <div 
              className="range-slider flat" 
              data-ticks-position="top" 
              min-range={lowerBoundData()} 
              max-range={upperBoundData()}
              style={
                {
                  '--min': rangeData.minRange,
                  '--max': rangeData.maxRange,
                  '--value-a': noDataCheck.valueA,
                  '--value-b': noDataCheck.valueB,
                  '--value-c': rangeData.value,
                } as React.CSSProperties
              }>
              {rangeData.value !== null &&
                <React.Fragment>
                  <input className="first-input" type="range" min={String(rangeData.minRange)} max={String(rangeData.maxRange)} 
                  value={String(rangeData.lowerBound)} onChange={() => {}} />

                  {renderFirstInputValue()}

                  <input className="second-input" type="range" min={String(rangeData.minRange)} max={String(rangeData.maxRange)} 
                  value={String(rangeData.upperBound)} onChange={() => {}} />

                  {renderSecondInputValue()}

                  <input className="last-input" type="range" min={String(rangeData.minRange)} max={String(rangeData.maxRange)} 
                  value={String(rangeData.value)} onChange={() => {}} />
                  <output className='whitespace-nowrap' 
                  last-input-value={
                    (rangeData?.value && rangeData?.value > 0) && rangeData.rangeUnit ? String(rangeData.value) + rangeData.rangeUnit : String(rangeData.value)
                    }></output>
                </React.Fragment>
              }
              <div className={`range-slider__progress ${defaultAnomaly}`}></div>
            </div>

            <div className='inline-block text-xss sm:pl-2 md:pl-4 lg:pl-2 xl:pl-4 sm:w-5 md:w-10 text-left whitespace-nowrap'>{upperBoundData()}</div>

        </div>
      </div>
    </React.Fragment>
  );
}

