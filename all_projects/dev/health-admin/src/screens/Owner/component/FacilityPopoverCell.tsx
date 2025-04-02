import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';

import Popover, { PopOverItem } from 'components/Popover';
import { FacilityUsersInterface } from '../SourceSystem/lib/FacilityFormHelper';
import { SourceSystemTypes } from 'health-generatedTypes';

export default function FacilityPopoverCell(props: { data: FacilityUsersInterface }) {
  const navigate = useNavigate();
  const { clientId }: { clientId: string } = useParams() as any;

  function onEdit(id: string, systemId: string, systemName: string, facilityName: string) {
    navigate(routes.owner.updateFacility.build(clientId, id, {
      systemId: systemId, systemName: systemName, facilityName: facilityName
    }));
  }

  return (
    <div className="md:inset-y-1/2 right-0 md:transform md:rotate-0 flex items-center relative md:static">
      
        <Popover>
        {props.data.sourceSystem !== SourceSystemTypes.ehr && (
          <PopOverItem
            className='hidden'
            onClick={() =>
              onEdit(
                props.data.id,
                props.data.sourceSystemId,
                props.data.sourceSystem,
                props.data.facilitiesName,
              )
            }>
            Edit
          </PopOverItem>
          )}
          <PopOverItem
            onClick={() => navigate(routes.owner.activeUserForFacility.build(String(props.data.id)))}
          >
            Active Users
          </PopOverItem>
        </Popover>
      
    </div>
  );
}
