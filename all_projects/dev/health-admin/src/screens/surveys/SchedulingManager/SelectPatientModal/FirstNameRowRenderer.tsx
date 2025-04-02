import React, { useEffect, useState } from 'react';
import { GridApi, ICellRendererParams } from '@ag-grid-community/core';

import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { useParams } from 'react-router-dom';
import { SentToPatientSelectedRows } from 'interface/app.slice.interface';
import { removeRowSelection } from 'components/ag-grid/remove-row-selection';

export default function FirstNameRowRenderer({
  patientListData,
  props,
  gridApi,
  isEditable
}: {
  props: ICellRendererParams;
  gridApi: GridApi | null | undefined;
  patientListData?: SentToPatientSelectedRows[];
  isEditable?: boolean
}) {
  
  const dispatch = useAppDispatch();
  const params = useParams();
  const [checked, setChecked] = useState(false);
  const selectedPatientData =
    useAppSelector((state) => state.app.sentToPatient) || [];
   

    // checkbox selection
    useEffect(() => {
      if (Boolean(selectedPatientData?.selectedRows?.find((d) => d.id === props.data.id))) {
        setChecked(true);
      } else if (
        Boolean(patientListData?.find((item) => item.userId === props.data.id && params.campaignId))
      ) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    }, [params.campaignId, patientListData, props.data.id, selectedPatientData.selectedRows]);

  return (
    <input
      type="checkbox"
      disabled={!isEditable}
      checked={checked}
      className={`${!isEditable && 'cursor-not-allowed'} `}
      onChange={() => {
        if (!!selectedPatientData?.selectedRows?.find((d) => d.id === props.data.id)) {
          dispatch(
            appSliceActions.setSelectedPatientRows(
              selectedPatientData?.selectedRows?.filter((d) => d.id !== props.data.id)
            )
          );
          removeRowSelection(gridApi, String(props.rowIndex));
        } else {
          dispatch(
            appSliceActions.setSelectedPatientRows([
              ...(selectedPatientData?.selectedRows || []),
              { ...props.data, gridRowId: props.rowIndex },
            ])
          );

        }
      }}
    />
  );
}
