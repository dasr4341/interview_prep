import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { PretaaHealthEventPatientList_pretaaHealthEventPatientList } from 'health-generatedTypes';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

// TODO: i have set patient-> any as type is not set at backend side
export default function DailyReportRowElement({ patient, onClick }: { patient: PretaaHealthEventPatientList_pretaaHealthEventPatientList, onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <>
      {patient && (
        <div
         onClick={() => onClick ? onClick() : navigate(routes.eventDetailsPage.build(String(patient.events[0].id)))}
          className="cursor-pointer font-bold text-base py-7 px-6 bg-white flex justify-between  border-b">
          <div className="block w-f capitalize">
            {`${patient.firstName} ${patient.lastName}`}
          </div>
          <button className="cursor">
            <DisclosureIcon />
          </button>
        </div>
      )}
      {!patient && <div className="p-4 text-center text-gray-150 text-sm">No data found</div>}
    </>
  );
}
