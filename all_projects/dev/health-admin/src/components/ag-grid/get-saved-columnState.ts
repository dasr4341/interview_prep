import { cloneDeep, sortBy, indexOf } from 'lodash';

import { ColumnObjectArgs } from 'health-generatedTypes';

// Get saved column State and sort columns based on saved state 
const getColumnState = ({ columnDefs, savedColumns, excludeList }: { columnDefs: any[]; savedColumns: ColumnObjectArgs[], excludeList: string[] }) => {

  if (savedColumns?.length === 0 || !savedColumns) {
    return columnDefs;
  }


  const updatedColumn =
    savedColumns?.map((item: ColumnObjectArgs) => {
      const column = columnDefs.find((el) => el.field === item.name);

      return {
        ...item,
        enable: excludeList.includes(item.name) ? !column.hide : item.enable,
      };
    }) || [];

  const columns = cloneDeep(columnDefs).map((el) => {
    const sel = updatedColumn.find((e: any) => el.field === e.name);
    
    return {
      ...el,
      hide: sel ? !sel?.enable : false,
    };
  });

  return sortBy(columns, (item) => indexOf(updatedColumn?.map((i: ColumnObjectArgs) => i.name), item.field));
};

export default getColumnState;
