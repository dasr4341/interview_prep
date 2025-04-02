/* eslint-disable react-hooks/exhaustive-deps */
import { AssignGroups, AssignGroupsVariables } from 'generatedTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { useEffect } from 'react';
import { RootState } from 'lib/store/app-store';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { AssignGroupsMutation } from 'lib/mutation/groups/assign-group';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { userManagementActions } from 'lib/store/slice/user-management';
import { successList } from '../../../../lib/message.json';
import { TrackingApi } from 'components/Analytics';

function Loading() {
  return (
    <>
      <div className="ph-item">
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
            <div className="ph-col-4 empty"></div>
            <div className="ph-col-2"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UserAction() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const selectedGroups = useSelector((state: RootState) => state.userManagement.group.selectedUserGroup);

  // Hooks for updating new role
  const [assignGroup, { loading, error }] = useMutation<AssignGroups, AssignGroupsVariables>(AssignGroupsMutation);

  const SaveAssignGroup = async () => {
    try {
      const updateVariables: AssignGroupsVariables = {
        groups: selectedGroups,
        userId: String(params.id),
      };
      await assignGroup({
        variables: updateVariables,
      });
      dispatch(userManagementActions.addUserGroup([]));
      navigate(routes.UserDetails.build(String(params?.id)));
      toast.success(successList.groupAdd);
    } catch (e) {
      catchError(e, true);
    }
  };

  useEffect(() => {
    if (params.id) {
      SaveAssignGroup();
    }
  }, [params]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.UserDetailsUpdate.name,
    });
  }, []);

  return (
    <>
      <ContentFrame>
        {loading && <Loading />}
        {error && <ErrorMessage message={error.message} />}
      </ContentFrame>
    </>
  );
}
