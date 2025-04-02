import { useQuery } from '@apollo/client';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import Card from 'components/ui/card/Card';
import { GetAdminCompanyQuery } from 'lib/query/company/get-admin-company';
import { GetGroupsCompanyAccessQuery } from 'lib/query/company-management/get-groups-company-access';
import { Link, useParams } from 'react-router-dom';
import { routes } from 'routes';
import ReadableNumber from '../../../components/ReadableNumber';
import { GetAdminCompany, GetAdminCompanyVariables, GetGroupsCompanyAccess, GetGroupsCompanyAccessVariables } from 'generatedTypes';
import { TrackingApi } from 'components/Analytics';
import { useEffect } from 'react';

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

export default function CompanyDetailScreenAdmin() {
  const { id } = useParams();
  const { data, loading } = useQuery<GetAdminCompany, GetAdminCompanyVariables>(GetAdminCompanyQuery, {
    variables: {
      companyId: String(id),
      contactsWhere: {
        primary: {
          equals: true,
        },
      },
    },
  });

  const { data: groupList, loading: groupListLoading } = useQuery<GetGroupsCompanyAccess, GetGroupsCompanyAccessVariables>(GetGroupsCompanyAccessQuery, {
    variables: {
      companyId: String(id),
    },
  });

  const companyGroupList = groupList?.pretaaGetAllGroupsOfCompanyAccess;
  const companyGroup = data?.pretaaGetCompanyAdmin;
  const primaryCompanyContact = data?.pretaaGetCompanyAdmin?.contacts
    .filter((item: { primary: boolean }) => item?.primary)
    .map((item: { name: string }) => item.name)
    .join(', ');

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyMgmtDetail.name,
    });
  }, []);

  return (
    <>
      <ContentHeader>
        <div className="block flex-1 relative text-primary mb-5 mt-2">
          <h1
            className="h1 leading-none text-primary font-bold 
              text-md lg:text-lg">
            {loading && !companyGroup && <Loading />}
            {companyGroup && companyGroup?.name}
          </h1>
        </div>
      </ContentHeader>
      <ContentFrame>
        <div className="mb-4">
          <h3 className="text-base font-bold mb-3">Company Detail</h3>
          <Card className="px-5 py-5 border-b border-gray-300">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-start-1 col-end-3 mb-3">
                <div className="pr-3 md:pr-0">
                  <h2 className="text-xs text-gray-600">Contact Person</h2>
                  <p className="capitalize text-gray-700">{primaryCompanyContact || 'NA'}</p>
                </div>
              </div>
              <div className="col-start-3 col-end-4 mb-3">
                <div className="pr-3 md:pr-0">
                  <h2 className="text-xs text-gray-600">CRM customer name</h2>
                  <p className="capitalize text-gray-700">{companyGroup?.customer?.name || 'NA'}</p>
                </div>
              </div>
              <div className="col-start-1 col-end-3 mb-3">
                <div className="pr-3 md:pr-0">
                  <h2 className="text-xs text-gray-600">SIC</h2>
                  <p className="capitalize text-gray-700">NA</p>
                </div>
              </div>
              <div className="col-start-3 col-end-4 mb-3">
                <div className="pr-3 md:pr-0">
                  <h2 className="text-xs text-gray-600">Number of Employees</h2>
                  <p className="capitalize text-gray-700">{companyGroup?.employeeCount ? <ReadableNumber number={companyGroup?.employeeCount as number} /> : 'NA'}</p>
                </div>
              </div>
              <div className="col-start-1 col-end-3">
                <div className="pr-3 md:pr-0">
                  <h2 className="text-xs text-gray-600">City</h2>
                  <p className="capitalize text-gray-700">NA</p>
                </div>
              </div>
              <div className="col-start-3 col-end-4">
                <div className="pr-3 md:pr-0">
                  <h2 className="text-xs text-gray-600">State, location</h2>
                  <p className="capitalize text-gray-700">NA</p>
                </div>
              </div>
              <div className="col-start-5 col-end-7">
                <div className="pr-3 md:pr-0">
                  <h2 className="text-xs text-gray-600">Region</h2>
                  <p className="capitalize text-gray-700">NA</p>
                </div>
              </div>
            </div>
          </Card>

          <h3 className="text-base font-bold mb-3 mt-10">Group access</h3>
          {groupListLoading && !groupList && <Loading />}
          {companyGroupList &&
            companyGroupList?.map((item) => {
              return (
                <Card>
                  <div
                    className="flex items-center px-6 py-5 h-20 rounded-xl shadow-sm 
              bg-white border border-gray-200">
                    <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-1 pl-4 md:pl-0">
                      <div className="pr-3 md:pr-0">
                        <p className="text-primary font-bold capitalize">{item?.name}</p>
                        <h2 className="text-xs text-gray-600">{item?._count?.users ? item?._count?.users : 0} Users</h2>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 grid grid-cols-2 md:grid-cols-1">
                      <h3 className="text-xs font-medium text-gray-600">Use Case</h3>
                      <p className="text-primary">{item?.useCaseCollections?.name}</p>
                    </div>
                    <div className="w-full md:w-1/3 grid grid-cols-2 md:grid-cols-1">
                      <h3 className="text-xs font-medium text-gray-600">Data Object Access</h3>
                      <p className="text-primary break-words">{item.dataObjectCollections?.name}</p>
                    </div>
                    <div
                      className="w-full md:w-1/3 grid grid-cols-2 md:grid-cols-1
           md:pr-5">
                      <h3 className="text-xs font-medium text-gray-600">Company Access list</h3>
                      <p className="text-primary break-words">{`${item?.lists.length > 0 ? item?.lists[0]?.list?.name : ''}
             ${item?.lists.length - 1 > 0 ? ' +' + (item?.lists.length - 1) + ' More' : ''}`}</p>
                    </div>
                    <div className="flex flex-row items-center">
                      <Link to={routes.groupDetails.build(String(item?.id))} className="cursor-pointer">
                        <DisclosureIcon />
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </ContentFrame>
    </>
  );
}
