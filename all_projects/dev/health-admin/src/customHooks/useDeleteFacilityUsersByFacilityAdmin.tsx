import { useLazyQuery } from '@apollo/client';
import { DeleteFacilityUsersForFacilityAdminQuery } from 'graphql/DeleteFacilityUsersQueryForFacilityAdmin.mutation';
import {
  DeleteFacilityUsersForFacilityAdmin,
  DeleteFacilityUsersForFacilityAdminVariables,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';

export default function useDeleteFacilityUsersByFacilityAdmin(onCompleted?: (m: DeleteFacilityUsersForFacilityAdmin) => void) {

  const [callApi, { loading, data, error }] = useLazyQuery<
    DeleteFacilityUsersForFacilityAdmin,
    DeleteFacilityUsersForFacilityAdminVariables
  >(DeleteFacilityUsersForFacilityAdminQuery, {
    onCompleted: (d) => onCompleted && onCompleted(d),
    onError: (e) => catchError(e, true),
  });

  return {
    callApi,
    loading,
    data,
    error,
  };
}
