import React from 'react';
import EyeCloseIcon from 'components/icons/EyeCloseIcon';
import EyeOpenIcon from 'components/icons/EyeOpenIcon';
import { GetPatientListData_pretaaHealthGetPatientsForCounsellor } from 'health-generatedTypes';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { fullNameController } from 'components/fullName';
import SelectCheckbox from '../SelectCheckbox';

export default function PatientListRow({
  loading,
  patient,
  changeVisibility,
  isAllSelected,
  multipleSelectModal,
  selectedCheckBox,
  setSelectedCheckBox,
  setIsAllSelected
}: {
  loading: boolean;
  patient: GetPatientListData_pretaaHealthGetPatientsForCounsellor;
  changeVisibility: (isAllSelected: boolean, patientId: string[], value:boolean) => void;
  isAllSelected :boolean;
  multipleSelectModal: boolean;
  selectedCheckBox: string[];
  setSelectedCheckBox: (ids: any) => void;
  setIsAllSelected: (boolean) => void
}) {

  const handleClick = (e) => {
    const { id, checked } = e.target;
    if (!checked) {
      setIsAllSelected(false);
      setSelectedCheckBox(selectedCheckBox.filter((item) => item !== id));
    } else {
      setSelectedCheckBox([...selectedCheckBox, id]);
    }
  };

  function eyeButtonCursorClass() {
    if (loading) {
      return 'cursor-wait';
    }
    return multipleSelectModal ? 'cursor-not-allowed' : 'cursor-pointer';
  };

  return (
    <>
      {patient && (
        <div
          className="font-bold capitalize text-base py-7 px-6 bg-white flex justify-between  border-b"
          data-testid="patient-row">
          <div className="flex w-4/5 gap-3">
            {multipleSelectModal && (
              <SelectCheckbox
                handleClick={handleClick}
                selectedCheckBox={selectedCheckBox.includes(patient.id) }
                id={patient.id}
              />
            )}
            {multipleSelectModal && (
              <label htmlFor={patient.id} className='cursor-pointer block w-full'>
                {fullNameController(patient.firstName, patient.lastName)}
              </label>
            )}
             {!multipleSelectModal && (
              <Link to={routes.patientDetails.build(patient.id)}>
                {fullNameController(patient.firstName, patient.lastName)}
              </Link>
            )}
          </div>
          <button
            className={`cursor ${eyeButtonCursorClass()}`}
            disabled={multipleSelectModal ? true : false}
            data-testid={patient?.UserPatientMeta?.length && patient?.UserPatientMeta[0].hidden ? 'close' : 'open'}
            onClick={() => patient?.UserPatientMeta?.length && !loading && changeVisibility(isAllSelected, [patient.id], !patient?.UserPatientMeta[0].hidden)}>
            {patient?.UserPatientMeta?.length && patient?.UserPatientMeta[0].hidden === true ? (
              <EyeCloseIcon />
            ) : (
              <EyeOpenIcon />
            )}
          </button>
        </div>
      )}
      {!patient && <>Patient not found</>}
    </>
  );
}
