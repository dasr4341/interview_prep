import React from 'react';

import DeleteIcon from 'components/icons/DeleteIcon';
import { CareTeamTypes } from 'health-generatedTypes';
import TypeTransform, { CareTeamsData } from './helper/PatientFormHelper';

export default function CareTeamList({
  careTeams,
  setCareTeamData,
}: {
  careTeams?: CareTeamsData[] | null;
  setCareTeamData: React.Dispatch<React.SetStateAction<CareTeamsData[]>>;
}) {
  const teams = TypeTransform(careTeams);


  return (
    <div>
      {teams?.map((el) => (
        <div key={`${el.careTeamType}-${el.careTeamId}`}>
          <div className="flex justify-between py-3 border-b border-gray-300 items-center">
            <div className="justify-between font-medium text-xsm  flex flex-1 items-center ">
              <div className="mr-1  capitalize">
                {el.careTeamStaffLabel ? el.careTeamStaffLabel : el.firstName + ' ' + el.lastName}
              </div>

              {el.careTeamType && String(el?.careTeamType) !== 'null' && (
                <div
                  className={`${
                    el.isPrimary ? 'bg-primary-light text-white' : 'bg-white text-black border border-black'
                  } rounded-full  px-3 py-1 text-xss capitalize`}>
                 {el.isPrimary ? 'Primary ': ''}
                  {el.careTeamType}
                </div>
              )}
            </div>
            {(!el.careTeamEnum?.includes(CareTeamTypes.CLINICAL_DIRECTOR) && !el.careTeamEnum?.includes(CareTeamTypes.ALUMNI_DIRECTOR)) && (
              <button
                className="ml-2"
                onClick={() => {
                  setCareTeamData((prevState) => {
                    const filteredCareTeam = prevState.filter((val) => val.careTeamId !== el.careTeamId);
                    return [...filteredCareTeam];
                  });
                }}>
                <DeleteIcon className="w-5 h-5 flex-grow-0 text-gray-600 cursor-pointer" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
