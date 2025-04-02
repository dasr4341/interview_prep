import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { SentToPatientSelectedRows } from 'interface/app.slice.interface';
import { AgGridReact } from '@ag-grid-community/react';
import { GetDisplayedRows } from './helper/GetDisplayedRows';

export default function HeaderRowRenderer({
  gridApi,
  isEditable
}: {
  gridApi: AgGridReact;
  isEditable?: boolean
}) {
  const dispatch = useAppDispatch();
  const selectedPatientData =
    useAppSelector((state) => state.app.sentToPatient) || [];

  const [gridDisplayedRows, setGridDisplayedRows] = useState<
    SentToPatientSelectedRows[]
  >([]);

  function handleOnchange(e: React.ChangeEvent<HTMLInputElement>) {
    // ------------------------ Setting the total number of visible patient data inside ag grid ----------------------------------
    // gridApi?.getFilterModel() -> gives the searched data
    const displayedRows: SentToPatientSelectedRows[] = !!Object.keys(
      gridApi?.api.getFilterModel()
    ).length
      ? GetDisplayedRows(gridApi?.api)
      : selectedPatientData.allPatientRows || [];

    if (!!Object.keys(gridApi?.api.getFilterModel()).length) {
      setGridDisplayedRows(displayedRows);
    }
    // ----------------------------------------------------------
    dispatch(
      appSliceActions.setSelectedPatientRows(
        e.target.checked ? displayedRows : []
      )
    );
  }


  useEffect(() => {
    if (!!Object.keys(gridApi?.api.getFilterModel()).length) {
      setGridDisplayedRows(GetDisplayedRows(gridApi?.api));
    } else {
      setGridDisplayedRows([]);
    }
    // 
  }, [selectedPatientData.selectedRows]);
  
  return (
    <div className=" flex items-center justify-start space-x-2">
      <input
        disabled={!isEditable}
        checked={
          !!selectedPatientData.selectedRows?.length &&
          (
            selectedPatientData.selectedRows?.length ===
            (gridDisplayedRows.length ||
              selectedPatientData?.allPatientRows?.length ||
              0)
          )
        }
        className={`${!selectedPatientData && ' cursor-wait '} ${!isEditable ? 'cursor-not-allowed' : 'cursor-pointer'} `}
        type="checkbox"
        onChange={(e) => handleOnchange(e)}
      />
    </div>
  );
}
