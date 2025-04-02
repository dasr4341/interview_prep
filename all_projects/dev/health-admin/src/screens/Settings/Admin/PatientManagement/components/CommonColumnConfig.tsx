import { ColDef } from '@ag-grid-community/core';
import { ColumnObjectArgs } from 'health-generatedTypes';
import { getAppData } from 'lib/set-app-data';
import { indexOf, sortBy } from 'lodash';

export enum AgGridHeaderName {
 name = 'name',
 facilitiesName = 'facilitiesName',
 facilityName = 'facilityName'
}

export const CommonColumnConfig: ColDef | any = {
  sortable: true,
  filter: 'agTextColumnFilter',
  suppressNavigable: true,
  lockPosition: window.innerWidth >= 640 ? 'left' : 'none',
  pinned: window.innerWidth >= 640 ? 'left' : 'none',
  lockPinned: window.innerWidth >= 640,
  lockVisible: window.innerWidth >= 640,
  filterParams: {
    buttons: ['clear']
  }
};

export function updateColumnsAndSetDefs({
  columns,
  savedColumns,
  setColumnDefs,
  mandatoryCol,
  fieldName,
  facilityName
}: {
  columns: any[];
  savedColumns: ColumnObjectArgs[];
  setColumnDefs: React.Dispatch<React.SetStateAction<any>>;
  mandatoryCol?: ColumnObjectArgs[] | any;
  fieldName: AgGridHeaderName;
  facilityName?: string
}) {
  const appData = getAppData();

  let updatedColumn = savedColumns?.map((item: ColumnObjectArgs) => {
    if (item.name === fieldName) {
      return { ...item, enable: true };
    }
    return item;
  });

  updatedColumn = savedColumns?.map((item: ColumnObjectArgs) => {
    if (item.name === facilityName) {
      return { ...item, enable: Number(appData.selectedFacilityId?.length) > 1 ? true : false };
    }
    return item;
  });

  if (updatedColumn?.length) {
    columns = columns.map((el) => {
      const sel = updatedColumn.find((e: any) => el.field === e.name);

      return {
        ...el,
        hide: sel && sel.enable ? false : true,
      };
    });

    const sortedColumns = sortBy(columns, (item) =>
      indexOf(
        updatedColumn?.map((i: any) => i.name),
        item.field
      )
    );
    if (mandatoryCol) {
      setColumnDefs([...sortedColumns, mandatoryCol]);
    } else {
      setColumnDefs(sortedColumns);
    }
    
  } else {
    if (mandatoryCol) {
      setColumnDefs([...columns, mandatoryCol]);
    } else {
      setColumnDefs(columns);
    }
  }
}
