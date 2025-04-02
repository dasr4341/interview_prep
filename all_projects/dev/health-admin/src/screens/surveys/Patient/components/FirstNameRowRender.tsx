import { GridApi, ICellRendererParams } from '@ag-grid-community/core';
import { removeRowSelection } from 'components/ag-grid/remove-row-selection';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import React from 'react';
import { useParams } from 'react-router-dom';


export default function FirstNameRowRender({ props, gridApi }: { props: ICellRendererParams; gridApi: GridApi | null | undefined }) {
  const dispatch = useAppDispatch();
  const selectedRow = useAppSelector((state) => state.app.sentToPatient.selectedRows) || [];
  const { assessmentId } = useParams();

  return (
    <input
        type="checkbox"
        disabled={!!assessmentId}
        className={`${assessmentId ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        checked={!!selectedRow.find((d) => d.id === props.data.id)}
        onChange={() => {
          if (!!selectedRow.find((d) => d.id === props.data.id)) {
            dispatch(appSliceActions.setSelectedPatientRows(selectedRow.filter((d) => d.id !== props.data.id)));
            removeRowSelection(gridApi, String(props.rowIndex));
          } else {
            dispatch(
              appSliceActions.setSelectedPatientRows([...selectedRow, { ...props.data, gridRowId: props.rowIndex }])
            );
          }
        }}
      />
  );
}
