import { useLazyQuery } from '@apollo/client';
import SkeletonLoading from 'components/SkeletonLoading';
import { config } from 'config';
import { getStaffQuery } from 'graphql/getStaff.query';
import {
  GetStaff,
  GetStaffVariables,
  GetStaff_pretaaHealthGetStaffUser,
  UserStaffTypes,
  UserTypeRole,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { formatDate } from 'lib/dateFormat';
import { useAppSelector } from 'lib/store/app-store';
import useSelectedRole from 'lib/useSelectedRole';
import { range } from 'lodash';
import React, { useEffect, useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { routes } from 'routes';

export default function DetailsScreen() {
  const [memberData, setMemberData] = useState<GetStaff_pretaaHealthGetStaffUser | null>(null);
  const careTeamLabels = useAppSelector((state) => state.app.careTeamTypesLabel.formattedData);
  const isSuperAdmin = useSelectedRole({ roles: [UserTypeRole.SUPER_ADMIN] });
  const [isAllowedToEdit, setIsAllowedToEdit] = useState(false);
  const currentUser = localStorage.getItem(config.storage.user_store);
  const parsedCurrentUser = currentUser && JSON.parse(currentUser);
  const { id: memberId } = useParams();
  const [teamMemberDetails, { loading }] = useLazyQuery<GetStaff, GetStaffVariables>(getStaffQuery, {
    onCompleted: (d) => {
      setMemberData(d.pretaaHealthGetStaffUser);
      const staffRoleSlug = d.pretaaHealthGetStaffUser?.roles?.map((i) => i.roleSlug);
      if (
        !isSuperAdmin &&
        (staffRoleSlug?.includes(UserStaffTypes.FACILITY_ADMIN) ||
          staffRoleSlug?.includes(UserStaffTypes.SUPER_ADMIN)) &&
        memberId !== parsedCurrentUser.pretaaHealthCurrentUser.id
      ) {
        setIsAllowedToEdit(false);
      } else if (
        isSuperAdmin &&
        staffRoleSlug?.includes(UserStaffTypes.SUPER_ADMIN) &&
        memberId !== parsedCurrentUser.pretaaHealthCurrentUser.id
      ) {
        setIsAllowedToEdit(false);
      } else {
        setIsAllowedToEdit(true);
      }
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    teamMemberDetails({
      variables: {
        userId: String(memberId),
      },
    });
  }, [memberId]);

  return (
    <>
      {!memberData && loading && (
        <React.Fragment>
          {range(0, 2).map((el) => (
            <div key={el}>
              <SkeletonLoading />
            </div>
          ))}
        </React.Fragment>
      )}
      {memberData && !loading && (
        <>
          <div className="flex font-bold text-pt-blue-300 mb-3">
            <h2 className="mr-4 text-base text-pt-primary">User Detail</h2>
            {isAllowedToEdit && (
              <Link to={routes.admin.careTeam.edit.build(String(memberId))}>
                <BsPencil size={20} />
              </Link>
            )}
          </div>

          <div className="bg-white px-5 py-6 rounded-xl flex flex-col border border-border">
            <div className="grid grid-cols-1 gap-5 md:gap-0 md:grid-cols-3 undefined">
              <div className="flex flex-col col-span-1 ">
                <div className="text-gray-600 mb-2  text-xss font-medium">Email</div>
                <div className="text-primary text-base font-normal">{memberData?.email || 'N/A'}</div>
              </div>
              <div className="flex flex-col col-span-1 ">
                <div className="text-gray-600 mb-2  text-xss font-medium">Phone Number</div>
                <div className="text-primary text-base font-normal">{memberData?.mobilePhone || 'N/A'}</div>
              </div>
              <div className="flex flex-col col-span-1 ">
                <div className="text-gray-600 mb-2  text-xss font-medium">Last Login</div>
                <div className="text-primary text-base font-normal">
                  {formatDate({ date: memberData.lastLoginTime, formatStyle: 'date-time' }) || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 rounded-xl flex flex-col">
            <div className="grid grid-cols-1 gap-5 md:gap-0 md:grid-cols-3 undefined">
              <div className="flex flex-col col-span-1 ">
                <div className="text-gray-600 mb-2  text-xss font-medium">Role</div>
                <div className="text-primary text-base font-normal capitalize">
                  {memberData?.roles?.map((r) => r.roleSlug.toLowerCase().replaceAll('_', ' ')).join(', ') || 'N/A'}
                </div>
              </div>

              {memberData?.careTeamTypes && (
                <div className="flex flex-col col-span-1 ">
                  <div className="text-gray-600 mb-2  text-xss font-medium">Care Team Types</div>
                  <div className="text-primary text-base font-normal capitalize pr-4">
                    {memberData?.careTeamTypes
                      ?.map((el) => careTeamLabels[el]?.updatedValue || careTeamLabels[el]?.defaultValue || 'N/A')
                      .join(', ') || 'N/A'}
                  </div>
                </div>
              )}

              <div className="flex flex-col col-span-1 ">
                <div className="text-gray-600 mb-2  text-xss font-medium">Status</div>
                <div className="text-primary text-base font-normal">
                  {memberData.active === true ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
