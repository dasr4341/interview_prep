import React, { useEffect, useRef, useState } from 'react';
import _, { range } from 'lodash';
import queryString from 'query-string';
import iconFilter from 'assets/icons/icon_filter.svg';
import ListModal from './components/modal/ListModal';
import { PatientFilterDataInterface } from './components/form/ListModalForm';
import PatientSelectedFilterOptions from './components/PatientSelectedFilterOptions';
import { patientFiltersQuery } from 'graphql/patientFilters.query';
import {
  GetPatientListData_pretaaHealthGetPatientsForCounsellor,
  GetPatientListData_pretaaHealthGetPatientsForCounsellor_UserPatientMeta,
  pretaaHealthPatientFilters,
  GetPatientListData,
  GetPatientListDataVariables,
  TogglePatientsVisibility,
  TogglePatientsVisibilityVariables,
} from 'health-generatedTypes';
import catchError, { getGraphError } from 'lib/catch-error';
import PatientViewSkeletonLoading from './skeletonLoading/PatientViewSkeletonLoading';
import PatientListRow from './components/PatientListElement';
import { GroupedVirtuoso, GroupedVirtuosoHandle } from 'react-virtuoso';
import NoDataFound from 'components/NoDataFound';
import { toast } from 'react-toastify';
import { patientVisibilityMutation } from 'graphql/patientVisibility.mutation';
import { config } from 'config';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPatientListQuery } from 'graphql/getPatientListData.query';
import { useLazyQuery, useMutation } from '@apollo/client';
import CustomSearchField from 'components/CustomSearchField';
import { TbEdit } from 'react-icons/tb';
import SelectCheckbox from './SelectCheckbox';
import Button from 'components/ui/button/Button';
import { useViewportSize } from '@mantine/hooks';

export interface FilterOptionStateInterface {
  data?: PatientFilterDataInterface[];
}

export interface VisibilityState {
  visible: string;
  hidden: string;
}

export interface PatientListStateInterface {
  data: GetPatientListData_pretaaHealthGetPatientsForCounsellor[][];
  moreData: boolean;
  groupCounts: number[];
  patients: GetPatientListData_pretaaHealthGetPatientsForCounsellor[];
}

function getPatientFilterQueryData(query: any) {
  // parsing filter data from url
  if (query) {
    query = queryString.parse(query)?.filter;
    return JSON.parse(query) || ([] as PatientFilterDataInterface[]);
  }
  return [];
}

export default function PatientList() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation() as any;
  const [searchedPhase, setSearchedPhase] = useState('');
  const [filterOptionState, setFilterOptionState] = useState<FilterOptionStateInterface>({
    data: getPatientFilterQueryData(location.search),
  });
  const {height} = useViewportSize()
  const ref = useRef<GroupedVirtuosoHandle>(null);
  const noOfRerender = useRef<number>(-1);
  const [patientListState, setPatientListState] = useState<PatientListStateInterface>({
    groupCounts: [],
    moreData: true,
    data: [],
    patients: [],
  });
  const [loading, setLoading] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [multipleSelectModal, setMultipleSelectModal] = useState<boolean>(false);
  const [selectedCheckBox, setSelectedCheckBox] = useState<string[]>([]);
  const [isMarkAsVisibleDisabled, setIsMarkAsVisibleDisabled] = useState<boolean>(false);
  const [isMarkAsHiddenDisabled, setIsMarkAsHiddenDisabled] = useState<boolean>(false);

  const [buttonState, setButtonState] = useState<VisibilityState>({
    visible: 'visible',
    hidden: 'hidden',
  });

  const handleSelectAll = () => {
    setIsAllSelected(!isAllSelected);

    if (isAllSelected) {
      setSelectedCheckBox([]);
    } else {
      setSelectedCheckBox(patientListState.patients?.map((li) => li.id));
    }
  };
  let visibilityOfPatients: boolean[] = [];

  useEffect(() => {
    const selectedPatients = patientListState.patients.filter((patient) => {
      return selectedCheckBox.includes(patient.id);
    });

    selectedPatients.forEach((patient) => {
      return patient.UserPatientMeta?.forEach((value) => {
        visibilityOfPatients.push(value.hidden);
      });
    });

    if (visibilityOfPatients.includes(true) && !visibilityOfPatients.includes(false)) {
      setIsMarkAsHiddenDisabled(true);
      setIsMarkAsVisibleDisabled(false);
    } else if (!visibilityOfPatients.includes(true) && visibilityOfPatients.includes(false)) {
      setIsMarkAsVisibleDisabled(true);
      setIsMarkAsHiddenDisabled(false);
    } else {
      setIsMarkAsVisibleDisabled(false);
      setIsMarkAsHiddenDisabled(false);
    }
  }, [isAllSelected, selectedCheckBox]);

  const handleMultipleSelectModal = () => {
    setMultipleSelectModal(!multipleSelectModal);
    setSelectedCheckBox([]);
    setIsAllSelected(false);
  };

  function getPatientSelectedOptions(options: PatientFilterDataInterface[]) {
    noOfRerender.current = noOfRerender.current + 1;
    setFilterOptionState((e) => {
      return { ...e, data: options };
    });
  }

  // get filter options
  const [getFilterOptions, { loading: getFilterOptionsLoading }] = useLazyQuery<pretaaHealthPatientFilters>(
    patientFiltersQuery,
    {
      onCompleted: (d) => {
        if (d.pretaaHealthPatientFilters) {
          const data = Object.keys(d.pretaaHealthPatientFilters).map((e) => {
            return {
              checked: false,
              label: d.pretaaHealthPatientFilters[e],
              value: e,
            };
          }) as PatientFilterDataInterface[];
          setFilterOptionState({ data });
        }
      },
      onError: (e) => catchError(e, true),
    },
  );

  function changeSelectedOptions(label: string) {
    setFilterOptionState((e) => {
      return {
        ...e,
        data: e?.data?.map((ele) => {
          if (ele.label === label) {
            return {
              ...ele,
              checked: !ele.checked,
            };
          }
          return ele;
        }),
      };
    });
  }

  function groupData(patientData: GetPatientListData_pretaaHealthGetPatientsForCounsellor[]) {
    const groupCounts: number[] = [];

    // now we will group the data
    const modifiedPatientData = _(patientData)
      .sortBy((a: GetPatientListData_pretaaHealthGetPatientsForCounsellor) => a.firstName?.charAt(0))
      .groupBy((a) => a.firstName?.charAt(0).toLowerCase())
      .map((comps) => {
        // we are calculating the group counts
        groupCounts.push(comps.length);

        // we are arranging the data in groups according to the alphabets
        return comps;
      })
      .value();

    return {
      data: modifiedPatientData,
      groupCounts,
    };
  }

  function clearAll() {
    setSearchedPhase('');
    getFilterOptions();
  }

  // ------------------------- patient list --------------------------------
  const [getPatientData, { loading: patientListLoading }] = useLazyQuery<
    GetPatientListData,
    GetPatientListDataVariables
  >(getPatientListQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetPatientsForCounsellor) {
        const { data, groupCounts } = groupData(
          (patientListState.data ? patientListState.data : []).flat().concat(d.pretaaHealthGetPatientsForCounsellor),
        );
        setPatientListState({
          moreData: d?.pretaaHealthGetPatientsForCounsellor?.length === config.pagination.defaultTake ? true : false,
          data: data,
          groupCounts: groupCounts,
          patients: patientListState?.patients.concat(d.pretaaHealthGetPatientsForCounsellor),
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  const [toggleVisibility] = useMutation<TogglePatientsVisibility, TogglePatientsVisibilityVariables>(
    patientVisibilityMutation,
    {
      onCompleted: (d) => {
        if (d.pretaaHealthTogglePatientsVisibility) {
          toast.success(d.pretaaHealthTogglePatientsVisibility);
        }
      },
      onError: (e) => catchError(e, true),
    },
  );

  // to change visibility
  async function changeVisibility(isAllSelected: boolean, patientIds: string[], value: boolean) {
    setLoading(true);

    const response = await toggleVisibility({
      variables: {
        selectAll: isAllSelected,
        patientsId: isAllSelected ? [] : patientIds,
        hidden: value,
      },
    });

    if (response.errors) {
      toast.error(getGraphError(response.errors).join(','));
    } else if (response.data?.pretaaHealthTogglePatientsVisibility) {
      if (multipleSelectModal === true) {
        handleMultipleSelectModal();
      }
      const list = _.cloneDeep(patientListState.patients);

      const listOfAllPatients = list.map((patient) => {
        return patient.id;
      });

      listOfAllPatients.forEach((element, index) => {
        if (isAllSelected === true) {
          list[index] = {
            ...list[index],
            UserPatientMeta: [
              { hidden: value },
            ] as unknown as GetPatientListData_pretaaHealthGetPatientsForCounsellor_UserPatientMeta[],
          };
          const groupedData = groupData(list);
          setPatientListState((e) => {
            return {
              ...e,
              data: groupedData.data,
              groupCounts: groupedData.groupCounts,
              patients: list,
            };
          });
        } else if (patientIds.includes(element) && !isAllSelected) {
          list[index] = {
            ...list[index],
            UserPatientMeta: [
              { hidden: value },
            ] as unknown as GetPatientListData_pretaaHealthGetPatientsForCounsellor_UserPatientMeta[],
          };
          const groupedDataForMultiplePatients = groupData(list);
          setPatientListState((e) => {
            return {
              ...e,
              data: groupedDataForMultiplePatients.data,
              groupCounts: groupedDataForMultiplePatients.groupCounts,
              patients: list,
            };
          });
        }
      });
    }
    setLoading(false);
  }

  function rowRendererVirtue(index: number, groupIndex: number) {
    // if first name is available, then only we will show the row
    if (!!patientListState.data.flat()[index]?.firstName) {
      return (
        <PatientListRow
          loading={loading}
          multipleSelectModal={multipleSelectModal}
          isAllSelected={isAllSelected}
          setIsAllSelected={setIsAllSelected}
          selectedCheckBox={selectedCheckBox}
          setSelectedCheckBox={setSelectedCheckBox}
          changeVisibility={changeVisibility}
          key={patientListState?.patients[index]?.id}
          patient={patientListState.data.flat()[index]}
        />
      );
    }
  }

  function footerComponent() {
    if (patientListLoading) {
      return (
        <div className="space-y-2">
          {range(0, 2).map((el) => (
            <React.Fragment key={el}>
              <PatientViewSkeletonLoading />
            </React.Fragment>
          ))}
        </div>
      );
    }
    return <div className="p-4 text-center text-gray-150 text-sm  bg-gray-100">No more data</div>;
  }

  useEffect(() => {
    if (!filterOptionState.data?.length) {
      getFilterOptions();
    }
    noOfRerender.current = noOfRerender.current + 1;
  }, []);

  useEffect(() => {
    setPatientListState({
      data: [],
      moreData: true,
      groupCounts: [],
      patients: [],
    });
    // first time this will load once to populate the array
    // in case of any change searchedPhase & selectedFilter
    // we will refresh the data in -> patientListState.data
    if (filterOptionState?.data?.length) {
      getPatientData({
        variables: {
          search: searchedPhase,
          skip: 0,
          take: config.pagination.defaultTake,
          patientFilters: filterOptionState.data?.filter((e) => e.checked)[0]
            ? filterOptionState.data?.filter((e) => e.checked).map((e) => e.value)
            : [''],
        },
      });
    }

    if (noOfRerender.current && filterOptionState?.data?.length) {
      navigate(
        `?${queryString.stringify({
          searchedPhase,
          filter: JSON.stringify(filterOptionState.data),
        })}`,
        { replace: true },
      );
    }
    //
  }, [searchedPhase, filterOptionState]);

  function handleEndReach() {
    // load more data, for that we have some prerequisite:
    // 1. see that we have any more data
    if (patientListState.moreData) {
      getPatientData({
        variables: {
          skip: patientListState.data.flat().length,
          take: config.pagination.defaultTake,
          search: searchedPhase,
          patientFilters: filterOptionState.data?.filter((e) => e.checked)[0]
            ? filterOptionState.data?.filter((e) => e.checked).map((e) => e.value)
            : [''],
        },
      });
    }
  }

  const findCharAtFirstIndex = (index: number) => {
    return (
      <div className="bg-gray-200 px-2 py-1 text-base font-bold uppercase z-1">
        {patientListState.data[index][0]?.firstName?.charAt(0) || ''}
      </div>
    );
  };

  return (
    <>
      <header className="px-4 sm:px-6 pt-8 pb-4 lg:px-16 top-0 bg-white z-20 shadow-outer  relative">
        <h1 className="h1 leading-none text-primary font-bold mb-5 text-md lg:text-lg break-normal pr-3 pt-2">
          Patients
        </h1>
        <div className="flex space-x-2 sm:space-x-4 my-3">
          <CustomSearchField
            defaultValue={searchedPhase}
            onChange={setSearchedPhase}
          />
          <button
            className="cursor"
            onClick={() => setShowModal(true)}>
            <img
              src={iconFilter}
              alt="filter"
            />
          </button>
        </div>

        <div className="flex space-x-2 overflow-x-auto">
          {filterOptionState.data
            ?.filter((e) => e.checked)
            .map((e) => (
              <PatientSelectedFilterOptions
                key={e.value}
                label={e?.label}
                changeSelectedOptions={changeSelectedOptions}
              />
            ))}
        </div>
      </header>

      {!!patientListState.patients.length && (
        <>
          {!multipleSelectModal ? (
            <div className="flex items-center gap-1 px-5 lg:px-16 sm:px-15 pt-3">
              <div className='flex cursor-pointer' onClick={handleMultipleSelectModal}>
                <TbEdit className="text-md text-gray-700 font-semibold" />
                <p className="underline">Edit</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center px-5 lg:px-16 sm:px-15 pt-3 gap-10">
              <div className="flex items-center gap-3">
                <SelectCheckbox
                  handleClick={handleSelectAll}
                  selectedCheckBox={isAllSelected}
                  id="selectAll"
                />
                <label
                  htmlFor="selectAll"
                  className="cursor-pointer block w-full">
                  Select All
                </label>
              </div>
              <button
                className="flex items-center gap-1 border border-[#E5E5EF] bg-[#F1F1F5] p-2 px-4 rounded-lg"
                onClick={handleMultipleSelectModal}>
                Cancel
              </button>
            </div>
          )}
        </>
      )}

      <div className="px-5 pb-5 lg:px-16 lg:pb-8 sm:px-15 sm:pb-10">
        <div className="h-custom relative">
          <div className="flex flex-col max-h-screen overflow-auto">
            {(!!filterOptionState?.data?.filter((e) => e.checked).length || !!searchedPhase.length) && (
              <div className="flex flex-row justify-end items-center p-2">
                <div
                  className="text-gray-150 font-medium text-sm underline cursor-pointer"
                  onClick={() => clearAll()}>
                  Clear all
                </div>
              </div>
            )}
            <div className="pt-5 lg:pt-8 sm:pt-10">
              {(patientListLoading || getFilterOptionsLoading) && !patientListState.data.length && (
                <>
                  {range(0, 7).map((el) => (
                    <React.Fragment key={el}>
                      <PatientViewSkeletonLoading />
                    </React.Fragment>
                  ))}
                </>
              )}

              {!(patientListLoading || getFilterOptionsLoading) &&
                !patientListState.data.length &&
                (searchedPhase || filterOptionState?.data?.filter((e) => e.checked).length ? (
                  <div className="flex flex-col flex-1 justify-center min-h-80 md:min-h-70">
                    <NoDataFound
                      type="SEARCH"
                      heading="No results"
                      content="Refine your search and try again"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 justify-center min-h-80 md:min-h-70">
                    <NoDataFound
                      type="NODATA"
                      heading="No patients yet"
                    />
                  </div>
                ))}

              {!getFilterOptionsLoading && !!patientListState.data.length && (
                <GroupedVirtuoso
                  style={ multipleSelectModal ? { height : (height - 380)} : {height :(height - 250)}} 
                  ref={ref}
                  groupCounts={patientListState.groupCounts}
                  groupContent={findCharAtFirstIndex}
                  endReached={handleEndReach}
                  itemContent={rowRendererVirtue}
                  components={{ Footer: footerComponent }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {multipleSelectModal && (
        <div className="z-10 flex items-center px-5 lg:px-16 sm:px-15 py-10 shadow-top gap-5 bg-white absolute bottom-0 w-full">
          <Button
            text="Mark as Visible"
            buttonStyle="gray"
            disabled={selectedCheckBox.length === 0 || isMarkAsVisibleDisabled || loading}
            loading={buttonState.visible === 'visible' && loading && selectedCheckBox.length !== 0}
            onClick={() => {
              changeVisibility(isAllSelected, selectedCheckBox, false);
              setButtonState({ visible: 'visible', hidden: '' });
            }}
          />

          <Button
            text="Mark as Hidden"
            disabled={selectedCheckBox.length === 0 || isMarkAsHiddenDisabled || loading}
            loading={buttonState.hidden === 'hidden' && loading && selectedCheckBox.length !== 0}
            buttonStyle="gray"
            onClick={() => {
              changeVisibility(isAllSelected, selectedCheckBox, true);
              setButtonState({ visible: '', hidden: 'hidden' });
            }}
          />
        </div>
      )}
      {showModal && (
        <ListModal
          loadingState={getFilterOptionsLoading}
          options={filterOptionState}
          selectedOptions={getPatientSelectedOptions}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
