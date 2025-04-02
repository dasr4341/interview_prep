import { useLazyQuery } from '@apollo/client';
import { DeleteFacilityUsersForSuperAdminQuery } from '../graphql/DeleteFacilityUsersForSuperAdmin.mutation';
import { DeleteFacilityUsersForSuperAdmin, DeleteFacilityUsersForSuperAdminVariables } from 'health-generatedTypes';
import catchError from 'lib/catch-error';

export default function useDeleteFacilityUsersBySuperAdmin(onCompleted?: (d: DeleteFacilityUsersForSuperAdmin) => void) {

  const [callApi, { loading, data, error }] = useLazyQuery<DeleteFacilityUsersForSuperAdmin, DeleteFacilityUsersForSuperAdminVariables>(DeleteFacilityUsersForSuperAdminQuery, {
    onCompleted: (d) => onCompleted && onCompleted(d), 
    onError: e => catchError(e, true)
  });

  return ({
    callApi,
    loading,
    data,
    error
  });
}
