import {
  FilterChangedEvent
} from '@ag-grid-community/core';

export const getFilteredObject = (e: FilterChangedEvent) => {
  const cols = e.columns;
  const def = cols[0]?.getUserProvidedColDef();
  const filterModel = e.api.getFilterModel();
  let text = '';
  // Takes only first filter
  // Multiple column query API does not support

  Object.keys(filterModel).forEach((key) => {
    if (text === '') {
      text = filterModel[key].filter;
    }
  });

  return {
    field: def?.field,
    text,
    filterModel
  };
};