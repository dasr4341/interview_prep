import {
  ColDef,
  ColGroupDef,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  CellClickedEvent,
  IsRowSelectable,
} from '@ag-grid-community/core';

export interface ColumnState {
  name: string;
  enable: boolean;
}


export interface AgGridDef {
  frameworkComponents?: any;

  columnDefs: (ColDef | ColGroupDef)[] | null;
  rowData: any[] | null;
  handleGridReady?: (e: GridReadyEvent) => void;
  changeVisibility?: (state: ColumnState[]) => void;
  updateColumnOrder?: (states: ColumnState[]) => void;
  rowSearch?: (field: string, text: string, e: FilterChangedEvent) => void;
  handleRowSelection?: (e: { data: any; isSelected: boolean | undefined; agGridApi: GridApi }) => void;
  onFirstDataRendered?: (e: FirstDataRenderedEvent) => void;
  onSelectionChanged?: (e: any) => void;
  pagination?: {
    page?: number;
    prevEnabled?: boolean;
    nextEnabled?: boolean;
    onPrevPage: (e: any) => void;
    onNextPage: (e: any) => void;
    prevLoading?: boolean;
    nextLoading?: boolean;
  } | null;
  gridStyle?: any;
  methodFromParent?: any;
  defaultTake?: number,
  onCellClicked?: (params: CellClickedEvent) => void,
  headerHeight?: number;
  sideBarWidth?: number;
  hideSideBar?: boolean;
  isRowSelectable?: IsRowSelectable
}
