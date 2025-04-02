import { AssessmentSelectedPatients } from 'interface/app.slice.interface';
import React from 'react';
import { AssessmentPatientListInterface } from '../../customHooks/useAssessmentReport';
import { SelectedPatientsType } from './AssessmentPatientFilter';

export default function AssessmentPatientOptions({
  option,
  selectedPatient,
  onChange,
}: {
  option: AssessmentPatientListInterface;
  selectedPatient: AssessmentSelectedPatients;
  onChange: (patients: AssessmentSelectedPatients) => void;
}) {
  return (
    <div className="px-3 border-b last:border-0">
      <div
        className="flex items-center space-x-3 uppercase w-full">
        <input
          id={`${option.id}`}
          type="checkbox"
          value={option.name}
          checked={
            (option.name === SelectedPatientsType.ALL && selectedPatient.all) ||
            !!selectedPatient.list.find((d) => d.id === option.id)
          }
          className={`appearance-none h-5 w-5 border
border-primary-light
checked:bg-primary-light checked:border-transparent
rounded-md form-tick`}
          onChange={(e) => {
            const selectedPatientsData = {
              all: Boolean(selectedPatient.all),
              list: [...selectedPatient.list],
            };

            // ---------------------------------- | For  checked | ---------------------
            if (e.target.checked) {
              if (option.name === SelectedPatientsType.ALL) {
                selectedPatientsData.all = true;
                selectedPatientsData.list = [];
              } else {
                selectedPatientsData.all = false;
                selectedPatientsData.list.push({
                  id: option.id,
                  name: option.name,
                });
              }
              onChange(selectedPatientsData);
              return;
            }

            // // ---------------------------------- | For un-checked | ---------------------
            if (option.name === SelectedPatientsType.ALL) {
              selectedPatientsData.all = false;
            } else {
              selectedPatientsData.list = selectedPatientsData.list.filter(
                (data) => data.id !== option.id
              );
            }
            onChange(selectedPatientsData);
          }}
        />
        <label
          className="text-primary font-semibold text-xs cursor-pointer w-full py-3"
          htmlFor={`${option.id}`}>
          {option.name}
        </label>
      </div>
    </div>
  );
}

