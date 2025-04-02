import Button from 'components/ui/button/Button';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Card from 'components/ui/card/Card';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getGroupDetails } from 'lib/query/usergroupdetails/user-group-details';
import { useMutation, useQuery } from '@apollo/client';
import { GetGroup, GetGroupVariables, PretaaDeleteGroup, PretaaDeleteGroupVariables, UserPermissionNames } from 'generatedTypes';
import { routes } from 'routes';
import { useDispatch } from 'react-redux';
import { userManagementActions } from 'lib/store/slice/user-management';
import { FaChevronRight } from 'react-icons/fa';
import { LabeledValue } from 'components/LabeledValue';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import { BsPencil, BsPlusCircleFill } from 'react-icons/bs';
import { deleteGroup } from 'lib/mutation/groups/delete-group';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import usePermission from 'lib/use-permission';
import { successList } from '../../../lib/message.json';
import { TrackingApi } from 'components/Analytics';
import ManageUser from 'components/settings/ManageUser';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';

export function Loading() {
  return (
    <>
      <div className="ph-item border-0">
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UserGroupDetail() {
  const navigate = useNavigate();
  const groupsPermission = usePermission(UserPermissionNames.GROUPS);
  const [openDialogue, setOpenDialogue] = useState(false);
  const { id } = useParams() as any;
  const dispatch = useDispatch();

  const { data, loading } = useQuery<GetGroup, GetGroupVariables>(getGroupDetails, {
    variables: {
      id,
      // This is required when groups modify
      usersTake: 100000000,
      listTake: 100000000,
      groupId: id,
    },
  });

  const [deleteGroupAction] = useMutation<PretaaDeleteGroup, PretaaDeleteGroupVariables>(deleteGroup, {
    onCompleted: () => {
      navigate(routes.groupList.match);
      toast.success(successList.groupDelete);
    },
    onError: (e) => {
      catchError(e, true);
    },
  });


  const addCompanyGroup = () => {
    const ids = data?.pretaaGetLists.map((list) => list.id) as string[];
    dispatch(userManagementActions.addCompanyGroup(ids));
  };

  function redirectToCompanyGroup() {
    addCompanyGroup();
    navigate(
      routes.companyGroupList.build({
        groupId: String(data?.pretaaGetGroup.id),
        canSelect: true,
      })
    );
  }

  function redirectToDataObject() {
    addCompanyGroup();
    navigate(
      routes.dataObjects.build({
        groupId: String(data?.pretaaGetGroup.id),
        canSelect: true,
        dataObjectId: data?.pretaaGetGroup.dataObjectCollections?.id,
      })
    );
  }

  function redirectToUseCases() {
    addCompanyGroup();
    navigate(
      routes.useCaseList.build({
        groupId: String(data?.pretaaGetGroup.id),
        canSelect: true,
        useCaseId: data?.pretaaGetGroup.useCaseCollections?.id,
      })
    );
  }

  function onConfirm() {
    deleteGroupAction({
      variables: {
        groupId: String(id),
      },
    });
    setOpenDialogue(false);
  }

  function onCancel() {
    setOpenDialogue(false);
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.groupDetails.name,
    });
  }, []);

  return (
    <>
      
      <ContentHeader className="lg:relative" link={routes.groupList.match}>
        <div
          className="block flex-1 
        relative text-primary mb-5 mt-2">
          <h1
            className="h1 leading-none text-primary font-bold 
              text-md lg:text-lg" data-test-id="page-title">
            {loading && <Loading />}
            {data && data?.pretaaGetGroup.name}
          </h1>
        </div>
        <ManageUser userCount={data?.pretaaGetGroup.users.length} />
      </ContentHeader>
      
      {!data?.pretaaGetLists && (
        <ErrorMessage message='This group does not exists.' />
      )}

      <ContentFrame type="with-footer">
        <div className="mb-4">
          <div className="pb-2 pt-4">
            <h3 className="h3">
              Company list access
              <button className="px-2 pl-0" onClick={redirectToCompanyGroup}>
                <BsPlusCircleFill className="text-primary-light inline ml-3" />
              </button>
            </h3>
          </div>
          {data?.pretaaGetLists.map((list) => (
            <Card className="p-6 flex items-center" key={list.id}>
              <h3 className="flex-1 text-base font-bold text-pt-primary">
                {list.name}
                <p className="text-xs text-gray-600 uppercase font-semibold">{list._count?.listCompanies || 0} companies</p>
              </h3>
              <div className="flex-1">
                <div className="flex justify-end">
                  <Link to={routes.companyGroupEdit.build(String(list?.id))}>
                    <FaChevronRight className="text-base text-gray-400" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mb-5">
          <div className="pb-2 pt-4">
            <h3 className="h3">
              Data Object Access
              <button className="px-2 pl-0" onClick={redirectToDataObject}>
                <BsPencil className="text-primary-light inline ml-3" />
              </button>
            </h3>
          </div>
          {data?.pretaaGetGroup.dataObjectCollections?.id && (
            <Card className="p-6 flex items-center">
              <h3 className="flex-1 text-base font-bold text-pt-primary">{data?.pretaaGetGroup.dataObjectCollections?.name}</h3>
              <LabeledValue label="Data Object Access" className="flex-1">
                Default access
              </LabeledValue>
              <div className="flex-1">
                <div className="flex justify-end">
                  <Link
                    to={routes.dataObjectsDetails.build({
                      id: String(data?.pretaaGetGroup.dataObjectCollections?.id),
                    })}>
                    <FaChevronRight className="text-base text-gray-400" />
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="mb-5">
          <div className="pb-2 pt-4">
            <h3 className="h3">
              Use Case Access
              <button className="px-2 pl-0" onClick={redirectToUseCases}>
                <BsPencil className="text-primary-light inline ml-3" />
              </button>
            </h3>
          </div>
          {data?.pretaaGetGroup.useCaseCollections?.id && (
            <Card className="p-6 flex items-center">
              <h3 className="flex-1 text-base font-bold text-pt-primary">{data?.pretaaGetGroup.useCaseCollections?.name}</h3>
              <LabeledValue label="Use Case Access" className="flex-1">
                Default access
              </LabeledValue>
              <div className="flex-1">
                <div className="flex justify-end">
                  <Link
                    to={routes.useCaseDetails.build({
                      id: String(data?.pretaaGetGroup.useCaseCollections?.id),
                    })}
                    className="md:float-right p-1">
                    <FaChevronRight className="text-base text-gray-400" />
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </ContentFrame>

      {groupsPermission?.capabilities.DELETE && (
        <ContentFooter className="flex justify-end">
          <Button style="danger" type="button" onClick={() => setOpenDialogue(true)} testId="delete-group-btn">
            Delete Group
          </Button>

          <ConfirmationDialog onConfirm={onConfirm} modalState={openDialogue} onCancel={onCancel}>
            Did you want to delete this group?
          </ConfirmationDialog>
        </ContentFooter>
      )}
    </>
  );
}
