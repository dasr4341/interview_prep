import { TicketsFilterOptions } from 'interface/url-query.interface';
import React, { useEffect, useRef, useState } from 'react';
import SelectedEvent from 'screens/EventsScreen/component/SelectedEvents';
import EventsFilterToggler from './EventFilterToggler';
import EventOrTimelineView from './EventOrTimelineView';
import queryString from 'query-string';
import { routes } from 'routes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  PatientName,
  PatientNameVariables,
  TimelineFilter,
  TimelineFilterVariables,
} from 'health-generatedTypes';
import { format } from 'date-fns';
import { config } from 'config';
import { fullNameController } from './fullName';
import { useLazyQuery } from '@apollo/client';
import { patientNameQuery } from 'graphql/get-patient-name';
import './_event-header-style.scoped.scss';
import { getTimelineFilters } from 'graphql/healthEventFilters.query';
import catchError from 'lib/catch-error';
import { Skeleton } from '@mantine/core';
import leftIcon from 'assets/icons/icon_primary_left.svg';
import { useElementSize } from '@mantine/hooks';
import { BiometricScoreLabel } from 'screens/Report/AssessmentReport/enum/AssessmentChartColorScheme';
import { useAppSelector } from 'lib/store/app-store';
import { buildUrl } from 'router/lib-router';
import CustomSearchField from './CustomSearchField';
import { getAppData } from 'lib/set-app-data';

export interface FilterStateInterface {
  optionList: TicketsFilterOptions[];
  startDate: string;
  endDate: string;
}
export interface VirtuosoInterface {
  startIndex: number;
  endIndex: number;
}

function getEventFilterQueryData(query: any) {
  // parsing filter data from url
  if (query) {
    query = queryString.parse(query);
    return {
      endDate: query?.endDate || '',
      startDate: query?.startDate || '',
      optionList: JSON.parse(query.optionList as string) || [],
    } as FilterStateInterface;
  }
  return {
    optionList: [],
    startDate: '',
    endDate: '',
  };
}

export default function EventOrTimeline() {
  const { patientId, type } = useParams();
  const isClinicalDirector = useAppSelector(state => state.auth.user?.pretaaHealthCurrentUser.isClinicalDirector);

  const { ref, height } = useElementSize();

  const navigate = useNavigate();
  const noOfRerender = useRef(-1);
  const location = useLocation() as any;
  const appData = getAppData();

  const [searchedPhase, setSearchedPhase] = useState('');
  const [clearSearchPhase, setClearSearchPhase] = useState(false);
  const [visibleRange, setVisibleRange] = useState<VirtuosoInterface>({
    startIndex: 0,
    endIndex: 0,
  });
  const assessmentFilter = useAppSelector((state) => state.app.assessmentFilter);

  function goBack() {
    navigate(-1);
  }

  function handleChange(newValue: any) {
    setVisibleRange(newValue);
  }

  const [filterState, setFilterState] = useState<FilterStateInterface>(getEventFilterQueryData(location.search));

  const [getPatient, { data: patientName, loading: patientNameLoading }] = useLazyQuery<
    PatientName,
    PatientNameVariables
  >(patientNameQuery, {
    onError: (e) => {
      catchError(e, true);
    }
  });

  const [getFilterOptions, { loading: getPatientEventFiltersLoading }] =
    useLazyQuery<TimelineFilter, TimelineFilterVariables>(getTimelineFilters, {
    onCompleted: (response) => {
      if (response.pretaaHealthEventFilters) {
        const responseData = response.pretaaHealthEventFilters;
       
        const data = Object.keys(responseData).map((e) => {
          const value = {
            label: responseData[e],
            value: e,
            checked: false,
          };

          if (
            (isClinicalDirector && e === 'IN_CENSUS') ||
            (e === 'FENCE' && type === BiometricScoreLabel.Geofence_Report) ||
            (e === 'ALERT' && type === BiometricScoreLabel.Anomalies_Report) ||
            (e === 'CONTACTED_HELPLINE' && type === BiometricScoreLabel.HelpLine_Report)
          ) {
            return {
              ...value,
              checked: true,
            };
          } else {
            return {
              ...value,
            };
          }
        });

        // we have to convert the data to a object which looks like => {value: '', label: ''}
        setFilterState((e) => {
          return { ...e, optionList: data };
        });
      }
    },
    onError: (err) => {
      catchError(err, true);
    },
  });

  function changeFilterState(filterData: FilterStateInterface) {
    noOfRerender.current = noOfRerender.current + 1;
    setFilterState(filterData);
  }

  function changeSelectedEvent(label: any) {
    setFilterState((f) => {
      return {
        ...f,
        optionList: f.optionList.map((e: TicketsFilterOptions) => {
          if (e.label === label) {
            return {
              ...e,
              checked: !e.checked,
            };
          }
          return e;
        }),
      };
    });
  }

  function changeSelectedDate() {
    setFilterState((f: FilterStateInterface) => {
      return {
        ...f,
        ...{
          startDate: '',
          endDate: '',
        },
      };
    });
  }

  function getSelectedOptions() {
    return (
      <div className="overflow-auto flex justify-start items-center w-full">
        <div className={`flex pb-2 flex-shrink-0 flex-row flex-wrap select-none -mr-16 no-scrollbar 
        ${visibleRange.endIndex > 10 ? 'pt-3 pl-4' : ''}`}>
          {filterState.optionList.map((e) => e.checked ? (
            <SelectedEvent
              key={e.label}
              label={e.label}
              onClick={changeSelectedEvent}
            />
          ) : null )}

          {filterState.startDate && (
            <SelectedEvent
              label={`${format(new Date(filterState.startDate), config.dateFormat)} - ${format(
                new Date(filterState.endDate),
                config.dateFormat,
              )}`}
              onClick={changeSelectedDate}
            />
          )}
        </div>
      </div>
    );
  }

  function clearAll() {
    setClearSearchPhase(!clearSearchPhase);
    setSearchedPhase('');
    if (!location.pathname.includes('/assessment-stats')) {
      setFilterState((e) => {
        return {
          optionList: e.optionList.map((element) => {
            return {
              ...element,
              checked: false,
            };
          }),
          startDate: '',
          endDate: '',
        };
      });
    }
  }

  // Generate options for filters
  useEffect(() => {
    if (!filterState.optionList.length) {
      getFilterOptions({
        variables: {
          patientId: patientId || null,
        },
      });
    }
  }, []);

  useEffect(() => {
    // passing the event filters through link
    // --- for timeline ----
    if (patientId && noOfRerender.current && filterState?.optionList.length && !type) {
      navigate(
        `?${queryString.stringify({
          ...filterState,
          searchedPhase: searchedPhase,
          optionList: JSON.stringify(filterState.optionList),
        })}`,
        { state: location.state, replace: true },
      );
    }

    // for assessment stats timeline
    if (type) {
      navigate(
        `?${queryString.stringify({
          startDate: assessmentFilter.selectedDayMonth?.dateRange.startDate,
          endDate: assessmentFilter.selectedDayMonth?.dateRange.endDate,
          dateFilter: assessmentFilter.selectedDayMonth?.dayMonth?.value,
          searchedPhase: searchedPhase,
          optionList: JSON.stringify(filterState.optionList),
        })}`,
        { state: location.state, replace: true },
      );
    }

    // --- for event ------
    if (!patientId && noOfRerender.current && filterState?.optionList.length) {
      navigate(
        buildUrl(routes.events.default.match, {
          ...filterState,
          searchedPhase: searchedPhase,
          optionList: JSON.stringify(filterState.optionList),
        }),
        { state: location.state, replace: true },
      );
    }

  }, [filterState, searchedPhase, appData.selectedFacilityId?.length]);

  useEffect(() => {
    if (patientId) {
      getPatient({
        variables: {
          patientId,
        },
      });
    }
  }, [patientId]);

  return (
    <>
      <header
        ref={ref}
        className="
        px-4 sm:px-6 pt-8 pb-4 lg:px-16 top-0 bg-white z-20 shadow-outer  relative
        ">
        <div>
          {patientId && (
            <div
              className="breadcrumb flex cursor-pointer w-fit mr-5"
              onClick={() => goBack()}
              data-testid="page-back-button">
              <img
                src={leftIcon}
                alt="left-icon"
              />
              <span className="ml-2.5">Back</span>
            </div>
          )}
        </div>
        <div
          className={` mb-4 items-center
            w-full ${visibleRange.endIndex > 10 ? 'block sm:flex gap-x-3' : ''}`}>
          <div>
            {patientNameLoading && (
              <Skeleton
                width={window.innerWidth < 640 ? '90%' : 400}
                height={24}
                mt={4}
              />
            )}
            <h1
              className={`h1 leading-none text-primary font-bold mb-5 ${
                visibleRange.endIndex > 10 && patientId
                  ? 'pr-3 text-md truncate pt-4 md:w-40 '
                  : 'text-md lg:text-lg break-normal pr-3 pt-2'
              }`}>
              {patientId && !patientNameLoading && patientName?.pretaaHealthPatientDetails.firstName && (
                <React.Fragment>
                  {fullNameController(
                    patientName?.pretaaHealthPatientDetails.firstName as string,
                    patientName?.pretaaHealthPatientDetails.lastName as string,
                  )}
                  's Timeline
                </React.Fragment>
              )}

              {patientId && !patientNameLoading && !patientName?.pretaaHealthPatientDetails.firstName && (
                <div>Timeline</div>
              )}

              {!patientId && !patientNameLoading && (
                <React.Fragment>Events</React.Fragment>
              )}
            </h1>
          </div>

          <div className="flex space-x-2 sm:space-x-4 my-3">
            <CustomSearchField
              defaultValue={searchedPhase}
              onChange={setSearchedPhase}
            />
            {!location.pathname.includes('/assessment-stats') && (
              <EventsFilterToggler
                loading={getPatientEventFiltersLoading}
                filterOptions={filterState.optionList}
                dateRange={{
                  startDate: filterState.startDate,
                  endDate: filterState.endDate,
                }}
                onApplyChange={changeFilterState}
              />
            )}
          </div>

          {/* ---------------- SELECTED OPTIONS -> FROM DROP DOWN  ---------------- */}
          {getSelectedOptions()}
          {/* -------------------------------------------- */}
        </div>
      </header>
      <div className="relative px-5 pt-2 lg:px-16 sm:px-15 overflow-hidden">
        <EventOrTimelineView
          headerHeight={height}
          patientId={patientId}
          filterState={filterState}
          searchPhrase={searchedPhase}
          clearAll={clearAll}
          getVisibleRange={handleChange}
        />
      </div>
    </>
  );
}
