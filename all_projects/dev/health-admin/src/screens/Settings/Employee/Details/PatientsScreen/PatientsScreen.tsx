import React, { useEffect, useState } from 'react';
import './PatientsScreen.scss';
import AgGrid from 'components/ag-grid/AgGrid';
import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { patientListQueryByEmployeeId } from 'graphql/viewEmployee.query';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  PatientListByEmployee,
  PatientListByEmployeeVariables,
} from 'health-generatedTypes';
import catchError, { getGraphError } from 'lib/catch-error';
import { ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import { useParams } from 'react-router-dom';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import { debounce } from 'lodash';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';

import { AgGridHeaderName, CommonColumnConfig, updateColumnsAndSetDefs } from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import { formatDate } from 'lib/dateFormat';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';
import { fullNameController } from 'components/fullName';
export interface PatientListInterface {
  patientId: string;
  name: string;
  email: string;
  dateOfOnboarding: string | null;
  status: string;
  phone: string;
  emergencyContact: string;
  lastLogin: string | null;
}
enum StatusType {
  active = 'Active',
  inactive = 'Inactive'
}

const NameCellRenderer = (props: { data: PatientListInterface }) => {
  if (props.data) {
    return (<div className='capitalize'>{props.data.name}</div>);
  }

  return (<div>{'N/A'}</div>);
};

const dateOfOnboardingCellRenderer = (props: { data: PatientListInterface }) => {
  const cellValue = props?.data?.dateOfOnboarding;
  if (cellValue) {
    return <div>{formatDate({ date: cellValue })}</div>
  }
  return <div>N/A</div>
}

const lastLoginCellRenderer = (props: { data: PatientListInterface }) => {
  const cellValue = props?.data?.lastLogin;
  if (cellValue) {
    return <div>{formatDate({ date: cellValue })}</div>
  }
  return <div>N/A</div>
}

export default function PatientsScreen() {
  const { id: employeeId } = useParams();
  const [gridApi, setGridApi ] = useState<GridReadyEvent | null>(null);
  const [patientList, setPatientList] = useState<PatientListInterface[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.STAFF_MANAGEMENT_PATIENT_LIST
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    const savedColumns = columnOrder?.pretaaHealthGetAgGridColumn?.columnList;
    const columns: (ColDef | any)[] = [
      {
        field: 'name',
        headerCheckboxSelection: false,
        checkboxSelection: false,
        showDisabledCheckboxes: false,
        cellRenderer: NameCellRenderer,
        cellClass: 'text-black lock-pinned',
        ...CommonColumnConfig
      },
      { field: 'email', filter: 'agTextColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      }, },
      { field: 'dateOfOnboarding', width: 240, filter: 'agDateColumnFilter', filterParams: {
        comparator: agGridDefaultFilterComparator, 
        buttons: ['clear']
      }, cellRenderer: dateOfOnboardingCellRenderer, sortable: true },
      {
        field: 'status',
        filter: 'ageSetColumnFilter',
        sortable: true,
      },
      { field: 'phone', filter: 'agTextColumnFilter', sortable: true, filterParams: {
        buttons: ['clear'],
      }  },
      { field: 'emergencyContact', filter: 'agTextColumnFilter', width: 240, sortable: true, filterParams: {
        buttons: ['clear'],
      } },
      { field: 'lastLogin', filter: 'agDateColumnFilter', filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear'],
      }, cellRenderer: lastLoginCellRenderer, sortable: true },
    ];

    updateColumnsAndSetDefs({ columns, savedColumns, setColumnDefs, fieldName: AgGridHeaderName.name  });
    
  }, [columnOrder]);

  

  const [getPatientList, { error: getPatientDataError, loading:listLoading }] = useLazyQuery<PatientListByEmployee, PatientListByEmployeeVariables>(patientListQueryByEmployeeId, {
    onCompleted: (d) => {
      const listResponse = d.pretaaHealthViewEmployee.employeeMeta?.patients || [];

      const list: PatientListInterface[] = listResponse.map((e) => {
        return  {
          patientId: e.id || '',
          name: fullNameController(e.firstName, e.lastName),
          email: e.email || 'N/A',
          dateOfOnboarding: formatDate({ date: e.createdAt, formatStyle: 'agGrid-date' }),
          status: e.active ? StatusType.active : StatusType.inactive,
          phone: e.mobilePhone || 'N/A',
          emergencyContact: e.patientContacts?.filter(el => el.fullName).map(el => el.fullName).join(', ') || 'N/A',
          lastLogin: formatDate({ date: e.lastLoginTime, formatStyle: 'agGrid-date' }),
        };
      });
      setPatientList(list);
    },
    onError: e => catchError(e, true)
  });

  const handleGridReady = (e: GridReadyEvent) => {
    setGridApi(e);
  };

  useEffect(() => {
    getPatientList({
      variables: { employeeId: String(employeeId) },
    });
  }, [employeeId]);

  useAgGridOverlay({ detailsLoading:listLoading, gridApi, list: patientList });

  const [updatePatientScreenColumnOrder] = useMutation<AgGridColumnManagement, AgGridColumnManagementVariables>(updateColumnOrderMutation);

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updatePatientScreenColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.STAFF_MANAGEMENT_PATIENT_LIST
      },
    });
  }

  const debounceUpdateState = debounce(handleUpdateColumnOrder, 2000);

  return (
    <React.Fragment>
      <AgGrid rowData={patientList} columnDefs={columnDefs} handleGridReady={handleGridReady}  updateColumnOrder={debounceUpdateState}
          changeVisibility={debounceUpdateState} />
      {getPatientDataError && <ErrorMessageFixed message={getGraphError(getPatientDataError.graphQLErrors).join(',')}/>}
    </React.Fragment>
  );
}
