/*  */
import  { useEffect } from 'react';
import { GridReadyEvent } from '@ag-grid-community/core';

export default function useAgGridOverlay(
  { detailsLoading, gridApi, list }: 
  { detailsLoading: boolean; gridApi: GridReadyEvent | null, list?: Array<any> }) {
  useEffect(() => {
    if (detailsLoading && gridApi) {
      gridApi.api.showLoadingOverlay();
    } 

    if (!detailsLoading && list && !list.length) {
      gridApi?.api.showNoRowsOverlay();
    } else if (!detailsLoading && list && list?.length > 0) {
      gridApi?.api.hideOverlay();
    }
   }, [detailsLoading, gridApi, list?.length]);
   
  return null;
}
