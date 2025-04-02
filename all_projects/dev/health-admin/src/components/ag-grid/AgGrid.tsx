import React, { useContext, useState } from 'react';
import { config } from 'config';
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import './AgGrid.scss';


import {
  ColumnMovedEvent,
  ColumnVisibleEvent,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridApi,
  RowSelectedEvent,
  SideBarDef,
  StatusPanelDef,
  ModuleRegistry,
} from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';

import { LicenseManager } from '@ag-grid-enterprise/core';
import LoadingImage from '../../assets/images/loading_icon.gif';
import { getFilteredObject } from './getFilteredObject';
import { AgGridDef } from './AgGrid.interface';
import { AgGridCheckboxContextData } from 'screens/Settings/Employee/components/EmployeeList/AgGridCheckboxContext';
import { PatientListHeader } from 'screens/Settings/Admin/PatientManagement/helper/PatientManagementHelper';
import { routes } from 'routes';
import { UserStaffTypes } from 'health-generatedTypes';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ExcelExportModule,
  SetFilterModule
]);

if (config.agGridKey) {
  LicenseManager.setLicenseKey(config.agGridKey);
}

const headerComponentParams = {
  template:
    '<div class="ag-cell-label-container" role="presentation">' +
    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
    '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
    '  </div>' +
    '</div>',
};

export const defaultColDef = {
  sortable: true,
  resizable: true,
  enablePivot: true,
  enableValue: true,
  headerComponentParams:headerComponentParams 
};

const defaultModule = [
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  StatusBarModule,
  SetFilterModule
];

export function isFirstColumn(params: any) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  return displayedColumns[0] === params.column;
}

const statusPanels: StatusPanelDef[] = [
  {
    statusPanel: 'agTotalAndFilteredRowCountComponent',
    align: 'left',
  },
  { statusPanel: 'agFilteredRowCountComponent' },
  { statusPanel: 'agSelectedRowCountComponent' },
  { statusPanel: 'agAggregationComponent' },
];

const matchPaths = [
  routes.admin.patientList.match,
  routes.admin.employee.list.build(UserStaffTypes.COUNSELLOR),
  routes.admin.employee.list.build(UserStaffTypes.FACILITY_ADMIN),
  routes.admin.employee.list.build(UserStaffTypes.SUPER_ADMIN)
];

export default function AgGrid({
  onCellClicked,
  frameworkComponents,
  columnDefs,
  rowData,
  handleGridReady,
  changeVisibility,
  updateColumnOrder,
  rowSearch,
  handleRowSelection,
  onFirstDataRendered,
  pagination,
  gridStyle,
  methodFromParent,
  defaultTake,
  headerHeight,
  sideBarWidth,
  hideSideBar,
  onSelectionChanged,
  isRowSelectable
}: AgGridDef) {
  const [grid, setGrid] = useState<GridApi | null>(null);
  const [filterChanged, setFilterChanged] = useState<boolean>(false);
  const isMatchLocation = matchPaths.includes(location.pathname);
       

  const sidebarConfig: SideBarDef = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        width: sideBarWidth,
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressColumnFilter: true,
          suppressColumnSelectAll: true,
          suppressColumnExpandAll: true,
        },
      },
    ],
    hiddenByDefault: hideSideBar || false
  };

  function onRowSelected(e: RowSelectedEvent) {
    if (handleRowSelection) {
      const { api } = e;
      const { node, data } = e;
      handleRowSelection({ data, isSelected: node.isSelected(), agGridApi: api });
    }
  }

  const {
    setFilterData,
    setIsFilterChanged
  } = useContext(AgGridCheckboxContextData);

  const onFilterReset = () => {
    // Cleaning all filter because of server side does not support complex
    // Query, So this is required unless query not work
    const gridVal = grid;
    gridVal?.setFilterModel(null); 
    gridVal?.onFilterChanged();  
    setGrid(gridVal);
    setFilterChanged(false);
  };
 
  return (
    <div className="ag-theme-alpine" style={gridStyle ? gridStyle : { height: '90%', width: '100%', fontSize: '17px' }}>
      {
       rowData && rowData?.length > 0 && filterChanged && (
          <div className="flex flex-row justify-end items-center px-5 pt-4 lg:px-16 sm:px-15">
          <div className="flex flex-row justify-end items-center p-2 right-0  underline cursor-pointer" onClick={onFilterReset}>
            Reset filters
          </div>
        </div>
        )
      }
       
        <div className='mb-5'></div>
      <AgGridReact
        onCellClicked={onCellClicked}
        suppressAutoSize={true}
        components={frameworkComponents}
        defaultColDef={defaultColDef}
        sideBar={sidebarConfig}
        columnDefs={columnDefs}
        modules={defaultModule}
        rowStyle={{ fontSize: '16px' }}
        rowData={rowData}
        headerHeight={headerHeight}
        statusBar={{ statusPanels }}
        rowSelection={'multiple'}
        isRowSelectable={isRowSelectable}
        suppressRowClickSelection={true}
        onGridReady={(e) => {
          setGrid(e.api);
          if (handleGridReady) {
            handleGridReady(e);
          }
        }}
        onColumnVisible={(e: ColumnVisibleEvent) => {
          if (changeVisibility) {
            const cols = e.columnApi.getColumnState();
            const colIds = cols?.map((c) => {
              return {
                name: String(c.colId),
                enable: Boolean(!c.hide)
              };
            });

            changeVisibility(colIds);
          }
        }}
        onColumnMoved={(e: ColumnMovedEvent) => {
          const cols = e.columnApi.getColumnState();
          const colIds = cols?.map((c) => {
            return {
              name: String(c.colId),
              enable: Boolean(!c.hide)
            };
          });
          if (updateColumnOrder) {
            updateColumnOrder(colIds);
          }
        }}
        onFilterChanged={(e: FilterChangedEvent) => {
          const filteredData = getFilteredObject(e);
          const getRowCount = e.api.getDisplayedRowCount();
          const isAnyFilterPresent = e.api.isAnyFilterPresent();

          if (isMatchLocation) {
            const filterDataForInvitationStatus = filteredData.filterModel[PatientListHeader.invitationStatus];
            setIsFilterChanged(!!filterDataForInvitationStatus);
            if (filterDataForInvitationStatus) {
              setFilterData(filterDataForInvitationStatus?.values);
            }
          }
        
          if (getRowCount === 0) {
            e.api.showNoRowsOverlay();
          } else {
            e.api.hideOverlay();
          }
        
          if (isAnyFilterPresent) {
              setFilterChanged(true);
           } else {
              setFilterChanged(false);
          }
          if (rowSearch && filteredData) {
            rowSearch(filteredData?.field as string, filteredData.text, e);
          }
        }}
        onSelectionChanged={(e) => {
          if (onSelectionChanged) {
            onSelectionChanged(e);
          }
        }}
        onRowSelected={(e: RowSelectedEvent) => {
          onRowSelected(e);
        }}
        onFirstDataRendered={(e: FirstDataRenderedEvent) => {
          if (onFirstDataRendered) {
            onFirstDataRendered(e);
          }
        }}
        context={{
          methodFromParent,
        }}
        ></AgGridReact>
      
      {(pagination && rowData && pagination?.page && (rowData.length === (defaultTake ?? config.pagination.defaultTake) || pagination?.page >= 1)) &&  (
        <nav className="pt-4 text-center">
          <ul className="inline-flex -space-x-px items-center">
            <li>
              <button
                disabled={!pagination.prevEnabled}
                onClick={() => pagination?.onPrevPage(grid)}
                className="py-2 px-3 ml-0 leading-tight text-gray-800 bg-white rounded-l-lg border
                 border-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-800 dark:border-gray-700 
                 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer flex items-center justify-center">
                  {pagination.prevLoading && <img src={LoadingImage} alt="prev" className="w-5 mr-2" />}
                  Previous
                </button>
            </li>

            <li>
              {(pagination.nextEnabled || pagination.prevEnabled) && (
                <span className="px-2">Page: {pagination?.page} </span>
              )}
            </li>

            <li>
              <button
                disabled={!pagination.nextEnabled}
                onClick={() => pagination?.onNextPage(grid)}
                className="py-2 px-3 leading-tight text-gray-800 
                bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-800 
                dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer flex items-center justify-center">
                  Next
                  {pagination.nextLoading && <img src={LoadingImage} alt="next" className="w-5 ml-2" />}
                </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
