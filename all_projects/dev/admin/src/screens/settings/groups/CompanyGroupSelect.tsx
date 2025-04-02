import React, { useEffect, useState } from 'react';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import SelectListRow from 'components/settings/new-group-list/SelectListRow';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CompanyGroups, CompanyGroups_pretaaGetLists, DeleteList, DeleteListVariables, OrderType, UserPermissionNames } from 'generatedTypes';
import { getCompanyGroups } from 'lib/query/company/company-groups';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { DeleteListMutation } from 'lib/mutation/company-management/delete-company-list';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import { companyManagementActions } from 'lib/store/slice/company-management';
import { useDispatch } from 'react-redux';
import usePermission from 'lib/use-permission';
import { SearchField } from '../../../components/SearchField';
import { userManagementActions } from 'lib/store/slice/user-management';
import useQueryParams from '../../../lib/use-queryparams';
import { successList } from '../../../lib/message.json';
import EmptyFilter from 'components/EmptyFilter';
import { TrackingApi } from 'components/Analytics';

export default function CompanyGroupSelectScreen() {
  const navigate = useNavigate();
  const [getCompanyGroup, { data: data }] = useLazyQuery<CompanyGroups>(getCompanyGroups, {
    variables: {
      // !Warning - this can crash the application if large number of data available
      // !TODO - add pagination
      // If we add pagination, we need to manage user group update logic too
      searchPhrase: '',
      take: 10000000,
      orderBy: OrderType.ASC,
    },
  });
  const [companyGroupList, setCompanyGroupList] = useState<CompanyGroups_pretaaGetLists[]>([]);
  const dispatch = useDispatch();
  const companyListPermissions = usePermission(UserPermissionNames.LISTS);
  const companyMgmtPermissions = usePermission(UserPermissionNames.COMPANIES_MANAGEMENT);
  const query = useQueryParams();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCompanyGroups, setSelectedCompanyGroups] = useState<{ id: string; selected: boolean }[]>([]);

  const [deleteGroup, { loading: loadingDeleteGroup }] = useMutation<DeleteList, DeleteListVariables>(DeleteListMutation, {
    onCompleted: () => {
      setCompanyGroupList(companyGroupList?.filter((x) => x.id !== selectedGroup));
      setSelectedGroup(null);
      toast.success(successList.listDelete);
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  useEffect(() => {
    if (data?.pretaaGetLists) setCompanyGroupList(data.pretaaGetLists);
  }, [data]);

  const handleDeleteList = (id: string) => {
    deleteGroup({
      variables: {
        id: id,
      },
    });
  };

  const handleConfirmDelete = (id: string) => {
    setSelectedGroup(id);
  };

  const handleCancel = () => {
    setSelectedGroup(null);
  };

  const listItem = companyGroupList.map((list, i) => {
    return (
      <SelectListRow
        key={i}
        list={list}
        selectedGroup={selectedGroup}
        loadingDeleteGroup={loadingDeleteGroup}
        onConfirmDelete={handleConfirmDelete}
        onDeleteList={handleDeleteList}
        onConfirmCancel={handleCancel}
        selectedCompanyGroups={selectedCompanyGroups}
        setSelectedCompanyGroups={setSelectedCompanyGroups}
      />
    );
  });

  function handleRedirect() {
    selectedCompanyGroups.forEach((group: any) => dispatch(userManagementActions.updateCompanyGroup(group)));
    if (query.groupId) {
      navigate(routes.userGroupAction.build(query));
    } else {
      navigate(routes.createUserGroup.match);
    }
  }

  const companyGroupFilter = (value: string) => {
    getCompanyGroup({
      variables: {
        searchPhrase: value,
        take: 10000000,
      },
    });
  };

  useEffect(() => {
    getCompanyGroup({
      variables: {
        searchPhrase: '',
        take: 10000000,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(companyManagementActions.resetSelectedCompanies());
  }, [dispatch]);

  const handleVisible = () => {
    return !!query.canSelect;
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyGroupList.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={query.canSelect ? 'Select a list' : 'Company List Management'} className="relative" disableGoBack={!handleVisible()} breadcrumb={handleVisible()}>
        <div className="flex flex-col sm:flex-row space-y-3">
          <SearchField
            label={'Search...'}
            onSearch={(value) => {
              companyGroupFilter(value);
            }}
          />
          {companyMgmtPermissions?.capabilities.VIEW && !query.canSelect ? (
            <Link to={routes.companyList.match} className="sm:absolute sm:right-4 sm:bottom-5 lg:bottom-12 lg:right-16">
              <Button>View companies</Button>
            </Link>
          ) : null}
        </div>
      </ContentHeader>
      <ContentFrame className="flex flex-col flex-1">
        {companyListPermissions?.capabilities.CREATE && !query.canSelect ? (
          <div className="flex justify-center md:justify-end">
            <Link to={routes.companyList.match}>
              <Button text="Create Company List" />
            </Link>
          </div>
        ) : null}
        {listItem?.length === 0 ? <EmptyFilter /> : <div className="pb-14 mt-8 border-t border-gray-300">{listItem}</div>}
      </ContentFrame>
      {query.canSelect && (
        <div
          className="py-4 px-5 lg:px-16 fixed bottom-0
        flex bg-white w-full">
          <Button text="Save" onClick={handleRedirect} />
          <Button
            text="Cancel"
            style="other"
            onClick={() => {
              navigate(-1);
            }}
          />
        </div>
      )}
    </>
  );
}
