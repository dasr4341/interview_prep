import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { format } from 'date-fns';

import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { routes } from 'routes';
import './_eventReport.scoped.scss';
import FilterClinicianList from './EventReportTemplate/Component/FilterCliniciansList';
import { useLazyQuery } from '@apollo/client';
import {
  GetTotalSurveySubmitBySelectedCliniciansReport,
  GetTotalSurveySubmitBySelectedCliniciansReportVariables,
  ReportingDateFilter,
} from 'health-generatedTypes';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import catchError from 'lib/catch-error';
import { config } from 'config';
import { getTotalSurveyCount } from 'graphql/getTotalSurveyCount.query';
import TabSkeletonLoading from 'screens/Report/skeletonLoading/TabSkeletonLoading';
import SelectWithDate from 'components/filters/SelectWithDate/SelectWithDate';
import { getReportVariables } from './get-filter-variables';
import SelectClinicianTypeFilter from './EventReportTemplate/Component/FilterClinicianType';
import useDayMonthRangeFilter from 'screens/Report/customHooks/useDayMonthRangeFilter';
import { SelectBox } from 'interface/SelectBox.interface';
import { range } from 'lodash';

export enum EventReportPageTypes {
  ALL = 'ALL',
  GAD7 = 'GAD-7',
  PHQ9 = 'PHQ-9',
  PHQ15 = 'PHQ-15',
}

interface TotalSurveyCount {
  value: number;
  label: EventReportPageTypes;
}

export default function EventReportPageLayout() {
  const dispatch = useAppDispatch();
  const eventReportFilterState = useAppSelector((state) => state.app.clinicianFilter);
  const { loading: dayMonthRangeLoading, options: dateFilterData } = useDayMonthRangeFilter('clinicianFilter');

  const [tabData, setTabData] = useState<TotalSurveyCount[]>([]);

  const location = useLocation();
  const [lastVisitedUrl, setLastVisitedUrl] = useState<null | string>(null);

  const clinicianFilterState = useAppSelector(
    (state) => state.app.clinicianFilter
  );


  // Tab data
  const [getTotalSurvey, { loading: tabLoading }] = useLazyQuery<
    GetTotalSurveySubmitBySelectedCliniciansReport,
    GetTotalSurveySubmitBySelectedCliniciansReportVariables
  >(getTotalSurveyCount, {
    onCompleted: (d) => {
      const tab:TotalSurveyCount[] = [];
      d.pretaaHealthGetTotalSurveySubmitBySelectedCliniciansReport?.forEach((t) => {
        const label = t.label.toUpperCase() as EventReportPageTypes;
        if (Object.values(EventReportPageTypes).includes(label)) {
          tab.push({
            label,
            value: t.value,
          });
        }
      });
      setTabData(tab);
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    getTotalSurvey({
      variables: {
        ...getReportVariables(eventReportFilterState),
      },
    });
  }, [eventReportFilterState]);


  useEffect(() => {
    if (!lastVisitedUrl && !clinicianFilterState.clinicianListAll && !clinicianFilterState.filterClinicianList.length) {
      dispatch(appSliceActions.setClinicianFilter({
        ...clinicianFilterState,
        clinicianListAll: true
      }));
    } 
    setLastVisitedUrl(location.pathname);
  }, [location.pathname]);


  return (
    <>
      <ContentHeader className="shadow-none" disableGoBack>
        <div className="block sm:flex sm:justify-between items-center">
          <div className="w-full sm:w-3/5">
            <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg">
              {`Reporting/Events
                ${
                  eventReportFilterState.filterMonthNDate.value === ReportingDateFilter.CUSTOM
                    ? `for ${eventReportFilterState.rangeStartDate} - ${eventReportFilterState.rangeEndDate}`
                    : ''
                }`}
            </h1>
          </div>

          <div className="w-full sm:w-2/5 lg:w-1/2 xl:w-3/12 flex justify-end ">
            <SelectClinicianTypeFilter className=" w-full mt-4 md:mb-0 mb-4 md:mt-0" />
          </div>
        </div>
        <div className="flex flex-row space-x-4 items-start md:mt-12">
          <div className="w-full flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between md:justify-start">
            <div
              className="flex mb-16 md:mb-0 lg:mb-16 xl:mb-0 flex-col md:flex-row lg:flex-col xl:flex-row relative md:mr-4 
            items-start w-full md:w-7/12 lg:w-full xl:w-8/12 customWidth space-x-0 md:space-x-2 lg:space-x-0 xl:space-x-2 ">
              <div className="font-medium md:mt-2 text-xsmd text-gray-600 capitalize">Filter by:</div>
              <SelectWithDate
                maxDate={new Date()}
                keyToShowDateRange={ReportingDateFilter.CUSTOM}
                options={dateFilterData}
                defaultValue={eventReportFilterState.filterMonthNDate}
                loading={dayMonthRangeLoading}
                className="w-full md:w-9/12 lg:w-full xl:w-9/12 2xl:w-4/5 rounded-xl mt-4 md:mt-0 lg:mt-4 xl:mt-0"
                onApply={(fieldData: SelectBox, startDate: Date | null, endDate: Date | null) => {
                  dispatch(
                    appSliceActions.setClinicianFilter({
                      ...eventReportFilterState,
                      filterMonthNDate: fieldData as { label: string; value: ReportingDateFilter },
                      rangeStartDate: startDate ? format(startDate, config.dateFormat) : null,
                      rangeEndDate: endDate ? format(endDate, config.dateFormat) : null,
                    })
                  );
                }}
              />
            </div>
            <div className="mb-6 md:mb-0 lg:mb-6 xl:mb-0 w-full md:w-4/12 lg:w-full xl:w-6/12 patientListWidth">
              <FilterClinicianList className="w-full " />
            </div>
          </div>
        </div>
      </ContentHeader>
      {/*  ------------------------- TABS ------------------------- */}
      <section className=" px-4 lg:px-16 bg-white pt-4 flex flex-row ">
        {!tabLoading &&
          tabData.map((el: any) => (
            <NavLink
              key={el.label}
              to={routes.eventReport.reportPage.build(el.label)}
              className={({ isActive }) =>
                `flex flex-col cursor-pointer w-32 capitalize py-8 border-r-2 last:border-r-0 px-4 ${
                  isActive ? 'active' : ''
                }`
              }>
              <div className="text-gray-150 font-extrabold text-sm md:text-xmd md:leading-5">
                {el?.value?.toLocaleString()}
              </div>
              <div className="font-medium text-xss text-gray-600 mt-3">{el.label.replaceAll('_', ' ')}</div>
            </NavLink>
          ))}
        {tabLoading && (
          <React.Fragment>
          { range(0, 3).map(el => (
           <div key={el}><TabSkeletonLoading /></div>
          )) }
        </React.Fragment>
        )}
      </section>
      {/*  ------------------------- TABS Ends ------------------------- */}
      <ContentFrame>
        <Outlet />
      </ContentFrame>
    </>
  );
}
