import React, { useEffect, useState } from 'react';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import './_first-responders.scoped.scss';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import catchError from 'lib/catch-error';
import {
  AgGridColumnManagement,
  AgGridColumnManagementVariables,
  AgGridListTypes,
  CareTeamTypes,
  GetAgGridColumn,
  GetAgGridColumnVariables,
  GetPatientDetails,
  GetPatientDetailsVariables,
} from 'health-generatedTypes';
import { useParams } from 'react-router-dom';
import AgGrid from 'components/ag-grid/AgGrid';
import { getColumnOrderQuery } from 'graphql/getColumnOrder.query';
import { debounce } from 'lodash';
import { updateColumnOrderMutation } from 'graphql/updateColumnOrder.mutation';
import { AgGridHeaderName, CommonColumnConfig, updateColumnsAndSetDefs } from './components/CommonColumnConfig';
import { ColumnState } from 'components/ag-grid/AgGrid.interface';
import { getPatientDetails } from 'graphql/getPatientDetails.query';
import CustomCareTeamRoleType from 'components/CustomCareTeamRoleType';

interface FirstRespondersRowDataInterface {
  name: string;
  email: string;
  phone: string;
  role: CareTeamTypes;
}

const NameCellRenderer = (props: { data: FirstRespondersRowDataInterface }) => {
  if (props.data) {
    return (<div className="capitalize">{props.data.name}</div>);
  }

  return (<div>{'N/A'}</div>);
};

const careTeamRoleCellRenderer = (props: { data: FirstRespondersRowDataInterface }) => {
  if (props.data) {
    return <CustomCareTeamRoleType careTeamRole={props.data?.role} />;
  }
};

export default function PatientCareTeams() {
  const { id } = useParams();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [rowData, setRowData] = useState<FirstRespondersRowDataInterface[] | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  const { data: columnOrder } = useQuery<GetAgGridColumn, GetAgGridColumnVariables>(getColumnOrderQuery, {
    variables: {
      agGridListType: AgGridListTypes.PATIENT_MANAGEMENT_CARETEAM_LIST,
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    const savedColumns = columnOrder?.pretaaHealthGetAgGridColumn?.columnList;
    const columns: (ColDef | any)[] = [
      {
        field: 'name',
        cellClass: 'text-black font-medium lock-pinned',
        cellRenderer: NameCellRenderer,
      ...CommonColumnConfig
      },
      { field: 'email', filter: 'agTextColumnFilter', sortable: true },
      { field: 'phone', filter: 'agTextColumnFilter', sortable: true },
      { field: 'role', filter: 'agTextColumnFilter', sortable: true, cellRenderer: careTeamRoleCellRenderer },
    ];

    updateColumnsAndSetDefs({ columns, savedColumns, setColumnDefs, fieldName: AgGridHeaderName.name });
  }, [columnOrder]);

  const [getPatientsDetailsData] = useLazyQuery<GetPatientDetails, GetPatientDetailsVariables>(getPatientDetails, {
    onCompleted: (data) => {
      if (data.pretaaHealthPatientDetails.patientContactList?.careTeams) {
        setRowData(
          data?.pretaaHealthPatientDetails?.patientContactList?.careTeams?.map((user) => ({
            name: user?.fullName || 'N/A',
            email: user?.email || 'N/A',
            phone: user?.phone || 'N/A',
            role:  user.careTeamTypes as CareTeamTypes
          })),
        );
      }
      if (gridApi) {
        gridApi.showNoRowsOverlay();
      }
    },
    onError: (e) => {
      catchError(e, true);
      if (gridApi && !!rowData?.length) {
        gridApi.hideOverlay();
      } else if (gridApi) {
        gridApi.showNoRowsOverlay();
      }
    },
  });

  useEffect(() => {
    if (id) {
      getPatientsDetailsData({
        variables: {
          patientId: id,
        },
      });
    }
  }, [id]);

  const handleGridReady = (e: GridReadyEvent) => {
    e.api.showLoadingOverlay();
    setGridApi(e?.api);
    getPatientsDetailsData({
      variables: {
        patientId: id as string,
      },
    });
  };

  useEffect(() => {
    if (!!rowData?.length) {
      getPatientsDetailsData({
        variables: {
          patientId: id as string,
        },
      });
    }
  }, [id]);

  const [updateCareTeamColumnOrder] = useMutation<AgGridColumnManagement, AgGridColumnManagementVariables>(
    updateColumnOrderMutation,
  );

  function handleUpdateColumnOrder(state: ColumnState[]) {
    updateCareTeamColumnOrder({
      variables: {
        columns: state,
        agGridListType: AgGridListTypes.PATIENT_MANAGEMENT_CARETEAM_LIST,
      },
    });
  }

  const debounceUpdateState = debounce(handleUpdateColumnOrder, 2000);

  return (
      <div className="h-custom w-full mt-5">
         <div className="h-screen lg:h-full">
        <AgGrid
          rowData={rowData}
          handleGridReady={handleGridReady}
          columnDefs={columnDefs}
          updateColumnOrder={debounceUpdateState}
          changeVisibility={debounceUpdateState}
        />
        </div>
      </div>
  );
}
