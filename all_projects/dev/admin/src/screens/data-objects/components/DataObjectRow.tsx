import React from 'react';
import { LabeledValue } from 'components/LabeledValue';
import Popover, { PopOverItem } from 'components/Popover';
import { Link } from 'react-router-dom';
import usePermission from '../../../lib/use-permission';
import { UserPermissionNames } from 'generatedTypes';
import useQueryParams from 'lib/use-queryparams';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';

export default function DataObjectRow({
  objectTitle,
  selectedObject,
  id,
  routes,
  onDelete,
  onObjectSelection,
}: {
  objectTitle: string;
  selectedObject: string;
  id: string;
  routes: string;
  onDelete: () => void;
  onObjectSelection: any;
}) {
  const rolePermission = usePermission(UserPermissionNames.DATA_OBJECT_COLLECTIONS);
  const query = useQueryParams();

  return (
    <>
      <div
        className="bg-white border-not-last-child 
        flex space-x-4 items-center p-6 data-row" data-test-id="data-object-row">
        {query?.canSelect && (
          <input
            type="radio"
            className='cursor-pointer'
            value={`${id}`}
            checked={selectedObject === id}
            onChange={(e) => onObjectSelection(e, id)}
          />
        )}
        <h3 className="flex-1 text-base font-bold" data-test-id="data-object-title">{objectTitle}</h3>
        <LabeledValue label="Data Object Access" className="flex-1">
          All
        </LabeledValue>
        {query?.canSelect && (
          <Link to={routes} className="cursor-pointer">
            <DisclosureIcon />
          </Link>
        )}
        {!query?.canSelect &&
          (rolePermission?.capabilities.EDIT || rolePermission?.capabilities.DELETE) && (
            <div className="md:inset-y-1/2  md:transform md:rotate-90">
              <Popover>
                {rolePermission?.capabilities.EDIT && (
                  <Link to={routes} className="block outline-none">
                    <PopOverItem>
                      EDIT
                    </PopOverItem>
                  </Link>
                )}
                {rolePermission?.capabilities.DELETE && selectedObject != id &&  (
                  <PopOverItem onClick={onDelete}>DELETE</PopOverItem>
                )}
              </Popover>
            </div>
          )
        }
      </div>
    </>
  );
}
