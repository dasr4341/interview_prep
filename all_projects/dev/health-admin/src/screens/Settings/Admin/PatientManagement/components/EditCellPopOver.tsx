import React from 'react';
import Popover, { PopOverItem } from 'components/Popover';
import { ICellRendererParams } from '@ag-grid-community/core';
import { ImSpinner7 } from 'react-icons/im';
import { DeletePatientOrStaffStateInterfaceByFacilityAdmin } from 'screens/Settings/interface/DeletePatientOrStaffStateInterfaceByFacilityAdmin';

export interface EditCellPopOverDeleteStaffInterface {
  deletePatientState: DeletePatientOrStaffStateInterfaceByFacilityAdmin,
  setDeletePatientState: React.Dispatch<React.SetStateAction<DeletePatientOrStaffStateInterfaceByFacilityAdmin>>,
  loading: boolean
}

export default function EditCellPopOver({
  rowData,
  deletePatient,
}: {
  rowData: ICellRendererParams;
  deletePatient: EditCellPopOverDeleteStaffInterface;
}) {
  return (
    <div className="flex justify-between items-center">
      <Popover>
        <PopOverItem
          onClick={() => {
            if (deletePatient.loading) {
              return;
            }
            deletePatient.setDeletePatientState(() => ({
              modalState: true,
              selectedPatient: [rowData.data.id],
            }));
           }
          }>
          <div className=' flex flex-row items-center'>
            Delete
            {deletePatient.deletePatientState?.selectedPatient?.includes(rowData.data.id) && deletePatient.loading ? <ImSpinner7 className="animate-spin ml-2" /> : ''}</div>
        </PopOverItem>
      </Popover>
    </div>
  );
}
