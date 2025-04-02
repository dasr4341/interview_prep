import React from 'react';

import { useAppSelector } from 'lib/store/app-store';
import { CareTeamTypes } from 'health-generatedTypes';

export default function CustomCareTeamRoleType({ careTeamRole }: { careTeamRole: CareTeamTypes }) {
  const careTeamTypesLabel = useAppSelector((state) => state.app.careTeamTypesLabel).formattedData;

  return (
    <div>
      {careTeamTypesLabel[careTeamRole]?.updatedValue ||
        careTeamTypesLabel[careTeamRole]?.defaultValue}
    </div>
  );
}
