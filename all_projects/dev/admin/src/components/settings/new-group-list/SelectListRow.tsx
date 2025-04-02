import { CompanyGroups_pretaaGetLists, UserPermissionNames } from 'generatedTypes';
import { CompanyGroupRouteInterface } from 'interface/company-group-route.interface';
import { RootState } from 'lib/store/app-store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import queryString from 'query-string';
import Popover, { PopOverItem } from 'components/Popover';
import ConfirmationBox from 'components/ConfirmationDialog';
import usePermission from 'lib/use-permission';
import { FaChevronRight } from 'react-icons/fa';
import { companyManagementActions } from 'lib/store/slice/company-management';

export default function SelectListRow({
  list,
  selectedGroup,
  loadingDeleteGroup,
  onDeleteList,
  onConfirmDelete,
  onConfirmCancel,
  selectedCompanyGroups,
  setSelectedCompanyGroups
}: {
  list: CompanyGroups_pretaaGetLists;
  selectedGroup: string | null;
  loadingDeleteGroup: boolean;
  onDeleteList: any;
  onConfirmDelete: any;
  onConfirmCancel: () => void;
  selectedCompanyGroups: { id: string; selected: boolean }[];
  setSelectedCompanyGroups: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        selected: boolean;
      }[]
    >
  >;
}) {
  const selectedGroups = useSelector((state: RootState) => state.userManagement.group.selectedCompanyGroup);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissions = usePermission(UserPermissionNames.LISTS);
  const query: CompanyGroupRouteInterface = queryString.parse(location.search);

  useEffect(() => {
    setSelectedCompanyGroups(selectedGroups.map((id) => ({ id, selected: true })));
  }, [selectedGroups, setSelectedCompanyGroups]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.checked;
    const obj = { id: list.id, selected };
    setSelectedCompanyGroups((prevValues) => [...prevValues.filter((o) => o.id !== obj.id), { ...obj }]);
  }

  function onEdit(id: string) {
    dispatch(companyManagementActions.countSelectedCompanies(Number(list._count?.listCompanies)));
    navigate(routes.companyGroupEdit.build(id));
  }

  return (
    <>
      <div
        className="border-b border-gray-300 bg-white py-4 px-4
      flex justify-between items-center"
        test-data-id="companies_List">
        <div className="relative pl-8">
          {query.canSelect && (
            <input
              type="checkbox"
              checked={selectedCompanyGroups.some((group) => group.id === list.id && group.selected)}
              onChange={handleChange}
              className={`appearance-none h-5 w-5 border border-primary-light checked:bg-primary-light 
              checked:border-transparent rounded-md form-tick absolute left-0 top-3`}
            />
          )}

          <h3 className="text-base text-primary font-bold">{list.name}</h3>
          <p className="uppercase text-xs text-gray-600 font-semibold">{list._count?.listCompanies || 0} Companies</p>
        </div>
        {query.canSelect && (
          <Link to={routes.companyGroupEdit.build(String(list.id))} className="block outline-none">
            <div className="flex-1">
              <div className="flex justify-end">
                <FaChevronRight className="text-base text-gray-400" />
              </div>
            </div>
          </Link>
        )}
        {!query.canSelect && (
          <div
            className="md:inset-y-1/2 
            md:transform md:rotate-90">
            {(permissions?.capabilities.EDIT || permissions?.capabilities.DELETE) && (
              <Popover>
                {permissions?.capabilities.EDIT && (
                  <PopOverItem onClick={() => onEdit(list.id)}> Edit </PopOverItem>
                )}
                {(permissions?.capabilities.DELETE) && (
                   <PopOverItem onClick={() =>  onConfirmDelete(list.id)}>
                    Delete
                  </PopOverItem>
                )}
              </Popover>
            )}
          </div>
        )}
      </div>
      <ConfirmationBox
        modalState={selectedGroup === list.id ? true : false}
        className="max-w-sm"
        disabledBtn={loadingDeleteGroup}
        onConfirm={() => onDeleteList(list.id)}
        onCancel={() => onConfirmCancel()}>
        Did you want to delete this list?
      </ConfirmationBox>
    </>
  );
}
