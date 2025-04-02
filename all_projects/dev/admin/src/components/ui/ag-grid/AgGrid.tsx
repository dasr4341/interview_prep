/* eslint-disable max-len */
import { ClientSideRowModelModule } from '@ag-grid-community/all-modules';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-alpine.min.css';
import {
  ColDef,
  ColGroupDef,
  ColumnMovedEvent,
  ColumnVisibleEvent,
  FilterChangedEvent,
  FilterOpenedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
  SideBarDef,
  StatusPanelDef,
} from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import {
  ColumnsToolPanelModule,
  StatusBarModule,
  // SetFilterModule,
  // MultiFilterModule,
  // FiltersToolPanelModule,
} from '@ag-grid-enterprise/all-modules';
import { LicenseManager } from '@ag-grid-enterprise/core';

// eslint-disable-next-line max-len
LicenseManager.setLicenseKey(
  'CompanyName=Pretaa Inc,LicensedApplication=Pretaa,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-025534,ExpiryDate=17_February_2023_[v2]_MTY3NjU5MjAwMDAwMA==aae242f10910ce7ed150138f9a410a82'
);

import './AgGrid.scss';
import { useState } from 'react';

export const defaultColDef = {
  sortable: true,
  resizable: true,
  enablePivot: true,
  enableValue: true,
  // Enable this for complex query UI
  // filter: true,
};

const sidebarConfig: SideBarDef = {
  toolPanels: [
    {
      id: 'columns',
      labelDefault: 'Columns',
      labelKey: 'columns',
      iconKey: 'columns',
      toolPanel: 'agColumnsToolPanel',
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
  defaultToolPanel: 'columns',
};

const defaultModule = [
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  StatusBarModule,
  // Enable this for complex filter UI
  // FiltersToolPanelModule,
  // MultiFilterModule,
  // SetFilterModule,
];

export const getFilteredObject = (e: FilterChangedEvent) => {
  const cols = e.columns;
  const def = cols[0].getUserProvidedColDef();
  const filterModel = e.api.getFilterModel();
  let text = '';
  // Takes only first filter
  // Multiple column query API does not support
  Object.keys(filterModel).forEach((key) => {
    if (text == '') {
      text = filterModel[key].filter;
    }
  });

  return {
    field: def?.field,
    text,
  };
};

interface AgGridDef {
  frameworkComponents?:
    | {
        [p: string]: {
          new (): any;
        };
      }
    | any;

  columnDefs: (ColDef | ColGroupDef)[] | null;
  rowData: any[] | null;
  handleGridReady: (e: GridReadyEvent) => void;
  changeVisibility?: (id: number, visible: boolean) => void;
  updateColumnOrder?: (ids: number[]) => void;
  rowSearch?: (field: string, text: string, e: FilterChangedEvent) => void;
  handleRowsSelection?: (rows: Array<any>, gridApi: GridApi) => void;
  handleRowSelection?: (e: { data: any; isSelected: boolean | undefined; agGridApi: GridApi }) => void;
  onFirstDataRendered?: (e: FirstDataRenderedEvent) => void;
  pagination?: {
    page?: number;
    prevEnabled?: boolean;
    nextEnabled?: boolean;
    onPrevPage: (e: any) => void;
    onNextPage: (e: any) => void;
  };
  gridStyle?: any;
}

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

export default function AgGrid({
  frameworkComponents,
  columnDefs,
  rowData,
  handleGridReady,
  changeVisibility,
  updateColumnOrder,
  rowSearch,
  handleRowsSelection,
  handleRowSelection,
  onFirstDataRendered,
  pagination,
  gridStyle,
}: AgGridDef) {
  const [grid, setGrid] = useState<GridApi | null>(null);

  const onSelectionChanged = (e: SelectionChangedEvent) => {
    if (handleRowsSelection) {
      const { api: gridApi } = e;
      const selectedRows = gridApi.getSelectedRows();
      handleRowsSelection(selectedRows, gridApi);
    }
  };

  function onRowSelected(e: RowSelectedEvent) {
    if (handleRowSelection) {
      const { api } = e;
      const { node, data } = e;
      handleRowSelection({ data, isSelected: node.isSelected(), agGridApi: api });
    }
  }

  return (
    <div className="ag-theme-alpine" style={gridStyle ? gridStyle : { height: '90%', width: '100%' }}>
      <AgGridReact
        frameworkComponents={frameworkComponents}
        defaultColDef={defaultColDef}
        sideBar={sidebarConfig}
        columnDefs={columnDefs}
        modules={defaultModule}
        rowData={rowData}
        statusBar={{ statusPanels }}
        rowSelection={'multiple'}
        suppressRowClickSelection={true}
        suppressScrollOnNewData={true}
        reactUi={true}
        onGridReady={(e) => {
          setGrid(e.api);
          e.api?.closeToolPanel();
          if (handleGridReady) {
            handleGridReady(e);
          }
        }}
        onColumnVisible={(e: ColumnVisibleEvent) => {
          if (changeVisibility) {
            changeVisibility(Number(e.column?.getColId()), e?.visible as boolean);
          }
        }}
        onColumnMoved={(e: ColumnMovedEvent) => {
          const cols = e.columnApi.getColumnState();
          const colIds = cols?.map((c) => Number(c.colId));
          if (updateColumnOrder) {
            updateColumnOrder(colIds);
          }
        }}
        onFilterChanged={(e: FilterChangedEvent) => {
          const filteredData = getFilteredObject(e);
          console.log(filteredData);
          if (rowSearch && filteredData) {
            rowSearch(filteredData?.field as string, filteredData.text, e);
          }
        }}
        onFilterOpened={(e: FilterOpenedEvent) => {
          // Cleaning all filter because of server side does not support complex
          // Query, So this is required unless query not work
          e.api.setFilterModel(null);
        }}
        onSelectionChanged={(e: SelectionChangedEvent) => {
          onSelectionChanged(e);
        }}
        onRowSelected={(e: RowSelectedEvent) => {
          onRowSelected(e);
        }}
        onFirstDataRendered={(e: FirstDataRenderedEvent) => {
          if (onFirstDataRendered) {
            onFirstDataRendered(e);
          }
        }}
       ></AgGridReact>
      {pagination && (
        <nav className="pt-4 text-center">
          <ul className="inline-flex -space-x-px items-center">
            <li>
              <button
                disabled={!pagination.prevEnabled}
                onClick={() => pagination?.onPrevPage(grid)}
                className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer">
                Previous
              </button>
            </li>
            <span className='px-2'>Page: {pagination?.page} </span>
            <li>
              <button
                disabled={!pagination.nextEnabled}
                onClick={() => pagination?.onNextPage(grid)}
                className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer">
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
