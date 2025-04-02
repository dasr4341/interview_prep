import { ContentHeader } from 'components/ContentHeader';
import React, { useContext, useEffect, useState } from 'react';
import Button from 'components/ui/button/Button';
import AgGrid from '../../../components/ag-grid/AgGrid';
import './FacilityManagement.scss';
import {  useNavigate, useParams } from 'react-router-dom';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { routes } from 'routes';
import {
  AdminListFacilities,
  AdminListFacilitiesVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import FacilityStatusCell, { CustomFacilityList } from '../component/FacilityStatusCell';
import { config } from 'config';
import { useLazyQuery } from '@apollo/client';
import FacilityPopoverCell from '../component/FacilityPopoverCell';
import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
import { CommonColumnConfig } from 'screens/Settings/Admin/PatientManagement/components/CommonColumnConfig';
import { adminFacilityList } from 'graphql/adminFacilityList.query';
import { FacilityUsersInterface } from '../SourceSystem/lib/FacilityFormHelper';
import useAgGridOverlay from 'lib/use-ag-grid-overlay';
import { textComparator } from 'lib/helperFunction/textComparator';
import { formatDate } from 'lib/dateFormat';
import CustomSearchField from 'components/CustomSearchField';
import { FacilityManagementContextData } from '../component/FacilityManagementContext';
import AgGridHeaderComponent from '../component/ActiveUserHeader';
import { agGridDefaultFilterComparator } from 'lib/helperFunction/dateComparator';

export default function FacilityManagement() {
  const navigate = useNavigate();
  const [gridApi, setGridApi] = useState<GridReadyEvent | null>(null);
  const [rowData, setRowData] = useState<FacilityUsersInterface[] | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const { clientId } = useParams();
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  
  const {
    startDate, endDate
  } = useContext(FacilityManagementContextData);


  const linkCellRenderer = function LinkCellRenderer(props: { data: FacilityUsersInterface }) {
      return <div>{props.data.facilitiesName}</div>;
  }
  const createdAtCell = ({ data } : { data: FacilityUsersInterface}) => {
    return <div>{formatDate({ date: data.createdAt }) || 'N/A'}</div>
  };

  function updatedStatus(props: CustomFacilityList) {
    return (
      <FacilityStatusCell
        updatedRowValue={setRowData}
        props={props}
      />
    );
  }

  useEffect(() => {
    const columns: (ColDef | any)[] = [
      {
        field: 'facilitiesName',
        headerCheckboxSelection: false,
        checkboxSelection: false,
        cellRenderer: linkCellRenderer,
        cellClass: 'lock-pinned',
        width: 250,
        ...CommonColumnConfig,
      },
      { field: 'createdAt', sortable: true, filter: 'agDateColumnFilter',  filterParams: {
        comparator: agGridDefaultFilterComparator,
        buttons: ['clear'],
        
      }, cellRenderer: createdAtCell },
      { field: 'timeZone', sortable: true, filter: 'agTextColumnFilter', filterParams: {
        buttons: ['clear'],
      },  comparator: textComparator },
      {
        field: 'status',
        cellRenderer: updatedStatus,
        sortable: true,
        filter: false,
      },
      { field: 'activePatients', sortable: true, headerComponent: AgGridHeaderComponent,  width: 250,},
      {
        field: '0',
        headerName: '',
        sortable: false,
        filter: false,
        pinned: 'left',
        cellRenderer: FacilityPopoverCell,
        suppressColumnsToolPanel: true,
        width: 90,
      },
    ];

    setColumnDefs(columns);
    
  }, []);

  const [getFacilityDataCallBack, { loading: facilityListLoading, data: facilityList }] = useLazyQuery<
  AdminListFacilities,
  AdminListFacilitiesVariables 
  >(adminFacilityList, {
    onCompleted: (response) => {
      if (response.pretaaHealthAdminListFacilities.length) {
        const resultantRowData = response.pretaaHealthAdminListFacilities.map((f) => {
          return {
            id: f.id,
            facilitiesName: f.name || 'N/A',
            status: f.isActive,
            createdAt: f.createdAt === 'N/A' ? null : formatDate({ date: f.createdAt, formatStyle: 'agGrid-date' }) || null,
            timeZone: f.timeZone || 'N/A',
            sourceSystemId: f.sourceSystemId,
            sourceSystem: f.sourceSystem?.slug,
            activePatients: f.activePatients
          };
        }) as FacilityUsersInterface[];
        setRowData(resultantRowData);
      } else {
        setRowData([]);
      }
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useAgGridOverlay({
    detailsLoading: facilityListLoading,
    gridApi,
    list: facilityList?.pretaaHealthAdminListFacilities,
  });

  function handleGridReady(e: GridReadyEvent) {
    setGridApi(e);
  }

  useEffect(() => {
    if (endDate) {
      getFacilityDataCallBack({
        variables: {
          searchPhrase: searchPhrase,
          skip: 0,
          take: config.pagination.defaultAgGridTake,
          accountId: String(clientId),
          startDate: startDate ? formatDate({ date: String(startDate) }) : null,
              endDate:  endDate ? formatDate({ date: String(endDate) }) : null
         
        }
      });
    }
 
  }, [searchPhrase, endDate]);

  return (
    <>
      <ContentHeader
      link={routes.owner.clientManagement.match}
        className="lg:sticky">
        <div className="block sm:flex sm:justify-between heading-area">
          <div className="header-left">
            <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5">
              Facility Management
            </h1>
            <CustomSearchField
                      defaultValue={searchPhrase}
                      onChange={setSearchPhrase}
                    />
          </div>
          <div className="header-right min-w-fit my-3 sm:my-0">
            <Button onClick={() => {
              navigate(routes.owner.sourceSystem.build(String(clientId)));
            }} className="flex justify-end">Add</Button>
          </div>
        </div>
      </ContentHeader>

      <ContentFrame className="h-screen lg:h-full">
        <AgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          handleGridReady={handleGridReady}
        />
      </ContentFrame>
    </>
  );
}
