/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@apollo/client';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { useState, useEffect } from 'react';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { routes } from 'routes';
import CompanyName from './components/CompanyName';
import {
  GetCompany,
  GetCompanyVariables,
  CompanyType,
  GetSimilarCompanies,
  GetSimilarCompaniesVariables,
  GetCompany_pretaaGetCompany,
  UserPermissionNames,
} from 'generatedTypes';
import AddFloatingButton, { FloatingButtonItem } from 'components/FloatingButton';
import LaunchIcon from 'components/icons/launch';
import HappyFace from 'components/icons/HappyFace';
import NoteIcon from 'components/icons/Note';
import AddIcon from 'components/icons/AddIcon';
import SearchIcon from 'components/icons/Seach';
import { GetCompanyQuery } from 'lib/query/company/get-company';
import { GetSimilarCompaniesQuery } from 'lib/query/company/get-similar-comopany';
import usePermission from 'lib/use-permission';
import CompanyBlock from './components/CompanyBlock';
import Button from 'components/ui/button/Button';
import needAttention from '../../assets/icons/need-attention.svg';
import { NavigationHeader } from 'components/NavigationHeader';
import NoteCreateModal from 'screens/notes/NoteCreateModal';
import ReferenceBudge from 'components/ReferenceBudge';
import { TrackingApi } from 'components/Analytics';
import _ from 'lodash';

export default function CompanyDetailScreen(): JSX.Element {
  const navigate = useNavigate();
  const referencePermission = usePermission(UserPermissionNames.ADD_A_REFERENCE);
  const timelinePermission = usePermission(UserPermissionNames.TIMELINE);
  const emailPermission = usePermission(UserPermissionNames.LAUNCH);
  const notesPermission = usePermission(UserPermissionNames.NOTES);
  const [companyData, setCompanyData] = useState();
  const { id }: { id: string } = useParams() as any;
  const [company, setCompany] = useState<GetCompany_pretaaGetCompany>();
  const [isOpen, setIsOpen] = useState(false);

  const { loading, error, data } = useQuery<GetCompany, GetCompanyVariables>(GetCompanyQuery, {
    variables: {
      companyId: String(id),
      contactsWhere: {
        primary: {
          equals: true,
        },
      },
    },
  });
  const { data: similarCompanyList } = useQuery<GetSimilarCompanies, GetSimilarCompaniesVariables>(
    GetSimilarCompaniesQuery,
    {
      variables: {
        companyId: String(id),
        skip: 0,
        take: 10,
      },
    }
  );

  useEffect(() => {
    if (data?.pretaaGetCompany) {
      setCompany(data?.pretaaGetCompany);
    }
  }, [data]);

  useEffect(() => {
    const companyDataList: any = similarCompanyList?.pretaaGetSimilarCompanies?.params || {};
    if (companyDataList) {
      const updateCompanyData: any = {
        filters: [],
        references: {
          surveyed: false,
        },
        industries: [],
        products: [],
        npsScore: { min: '', max: '' },
        employeeCount: { min: null, max: null },
        arr: { min: null, max: null },
      };
      Object.keys(companyDataList).forEach((key) => {
        if (key === 'products' || key === 'industries') {
          updateCompanyData[key] = companyDataList?.[key]?.map((item: { id: number }) => {
            return item.id;
          });
        } else if (key === 'references') {
          updateCompanyData.references.surveyed = companyDataList?.references?.surveyedOn || false;
          updateCompanyData[key] = { ...updateCompanyData[key], ...companyDataList[key] };
          delete updateCompanyData.references.surveyedOn;
        } else if (key === 'employees') {
          updateCompanyData.employeeCount = companyDataList[key];
        } else {
          updateCompanyData[key] = companyDataList[key];
        }
      });


      setCompanyData(updateCompanyData);
    }
  }, [similarCompanyList]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyDetail.name,
      companyId: String(id)
    });
  }, []);

  const handleReferenceRemoved = () => {
    if (company)
      setCompany({
        ...company,
        offeredOn: '',
        surveyedOn: '',
      });
  };

  const links = [
    {
      title: 'Notes',
      link: routes.companyNotes.build(`${company?.id}`, {
        count: company?.noteCount as number,
      }),
      count: company?.noteCount as number,
      isShow: company?.noteCount ? true : false,
      isView: true,
      id: 'notes'
    },
    {
      title: 'Launched',
      link: routes.launchedCompanyList.build({
        companyId: String(company?.id),
        count: String(company?.launchCount),
      }),
      count: company?.launchCount,
      isShow: company?.launchCount ? true : false,
      isView: emailPermission?.capabilities.VIEW ? true : false,
    },
    ...(timelinePermission?.capabilities?.VIEW
      ? [
          {
            title: 'Timeline',
            link: routes.companyTimeline.build({
              companyId: company?.id,
              count: company?.timelineCount as number,
              timeline: true,
            }),
            count: company?.timelineCount as number,
            isShow: company?.timelineCount ? true : false,
            isView: true,
            id: 'timeline'
          },
        ]
      : []),
    {
      title: 'References',
      // Can't use routes's build function as it stringify the query using QueryString package.
      link: routes.companyReferences.build(id, {
        count: company?.referencesCount as number,
      }),
      count: company?.referencesCount as number,
      isShow: company?.offeredOn || company?.surveyedOn ? true : false,
      isView: referencePermission?.capabilities.VIEW ? true : false,
    },
    {
      title: 'Opportunities',
      link: routes.companyOpportunities.build(id, {
        name: company?.name as string,
        count:  company?.opportunityCount as number,
      }),
      count: company?.opportunityCount,
      isShow: company?.opportunityCount ? true : false,
      isView: true,
      id: 'opportunities'
    },
  ];

  const rightLinks = [
    {
      title: 'Tickets',
      link: routes.companyTickets.build(id),
    },
    {
      title: 'Products',
      link: routes.products.build(id),
      error: false,
    },
    {
      title: 'Competitors',
      link: routes.competitors.build(id),
      error: false,
    },
    {
      title: 'Contacts',
      link: routes.companyContacts.build(id),
      error: false,
    },
  ];

  const linkViews = links
    .filter((items) => items?.isShow && items?.isView)
    .map((element) => {
      return (
        <Link
          data-test-id={`${element.id || element.title}-link`}
          key={element.title}
          to={element.link}
          className={`flex items-center justify-between px-4 
          py-3 border-b last:border-0 text-primary text-base font-normal
          cursor-pointer`}>
          <div>
            {element.title}{' '}
            {element.count && element.count > 0 ? <span className="text-red-500" data-test-count-id="count">({element?.count})</span> : ''}
          </div>
          <DisclosureIcon />
        </Link>
      );
    });

  const rightLinkView = rightLinks.map((link) => {
    return (
      <Link
        key={link.title}
        to={link.link}
        data-test-id={`${link.title}-link`}
        className={`flex items-center justify-between px-4 
          py-3 border-b last:border-0 cursor-pointer
          }`}>
        <div className="text-primary text-base font-normal">{link.title} </div>
        <div className="flex justify-center items-center">
          <DisclosureIcon />
        </div>
      </Link>
    );
  });

  const similarCompanies = similarCompanyList?.pretaaGetSimilarCompanies?.companies?.slice(0, 3)?.map((link) => {
    return (
      <Link
        key={link.name}
        to={`${routes.companyDetail.build(String(link.id))}`}
        className={`flex mt-2 text-base font-normal
        ${link.name ? 'text-primary-light underline' : 'text-primary'}`}>
        {link.name}
      </Link>
    );
  });

  function findReference() {
    if (companyData) {
      const queryParams: any = _.cloneDeep(companyData);

      // info: For now hardcode this data set as per Sneh 
      queryParams.npsScore = {
        min: 9,
        max: 10
      };

      
      navigate(`${routes.companies.match}?options=${JSON.stringify(queryParams)}`);
    }
  }

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-between flex-col md:flex-row">
          <div className="w-full">
            <NavigationHeader>
              <div className="flex flex-row items-center justify-between">
                <div className="block relative text-primary mb-0 mt-2 cursor-pointer" data-test-id="page-title">Details</div>

                {company?.needsAttention && (
                  <Button
                    style="other"
                    classes="float-right outline-none bg-pt-red-800 w-14 h-14 rounded-full cursor-auto"
                    size="xs">
                    <img
                      src={needAttention}
                      alt="button"
                      style={{ height: 28, width: 28, border: '1.5 solid #202030' }}
                    />
                  </Button>
                )}
              </div>
            </NavigationHeader>
            <div className="flex">
              {company?.companyType && (
                <div className="flex items-center">
                  <div
                    className={`inline-flex items-center 
                  bg-primary mr-2
                  rounded-full border border-primary
                  px-3 py-1 font-bold`}>
                    <span className="px-1 text-white uppercase text-xxs">{company?.companyType}</span>
                  </div>
                </div>
              )}
              {(company?.offeredOn || company?.surveyedOn) && (
                <ReferenceBudge companyId={String(id)} className={'my-0.5'} onRemoved={handleReferenceRemoved} />
              )}
            </div>
          </div>
        </div>
      </ContentHeader>
      <ContentFrame>
        {loading && !data && (
          <div className="ph-item">
            <div className="ph-col-12">
              <div className="ph-row">
                <div className="ph-col-6 big"></div>
                <div className="ph-col-4 empty big"></div>
                <div className="ph-col-2 big"></div>
              </div>
            </div>
          </div>
        )}
        {error && <ErrorMessage message={error.message} />}

        {!loading && !company && <ErrorMessage message="Unable to access company data" />}

        {company && (
          <>
            {company && (
              <CompanyName
                name={company?.name || ''}
                starred={Boolean(company?.starredByUser)}
                id={company?.id}
                className="px-6 py-5 h-20 mb-6 rounded-xl shadow-sm bg-white border border-gray-200 text-md"
                isLinked={false}
                isOnClickStar={true}
              />
            )}

            <div className="mb-6">{company?.id && <CompanyBlock id={company?.id} type="company" />}</div>

            <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 md:space-x-4 mb-6 w-full">
              {linkViews.length > 0 && (
                <div style={{ height: 'min-content' }} className="w-full bg-white border border-gray-200 rounded-xl" data-test-id='link-list'>
                  {linkViews}
                </div>
              )}

              <div style={{ height: 'min-content' }} className="w-full bg-white border border-gray-200 rounded-xl">
                {rightLinkView}
              </div>
            </div>

            <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 md:space-x-4 mb-6 w-full">
              {(similarCompanyList?.pretaaGetSimilarCompanies?.companies?.length as number) > 0 && (
                <div style={{ height: 'min-content' }} className="w-full bg-white border border-gray-200 rounded-xl">
                  <div className="bg-white rounded-xl px-5 py-6 mb-6 md:h-56 w-full">
                    <h5 className="block text-gray-600 text-xs font-medium">Similar companies</h5>
                    {similarCompanies}
                    <Link
                      to={`${routes.companies.match}?options=${JSON.stringify(companyData)}`}
                      className={`flex mt-2 text-base font-normal
                text-primary-light underline`}>
                      See more...
                    </Link>
                  </div>
                </div>
              )}
              <div className="w-full bg-white border border-gray-200 rounded-xl">
                <div className="bg-white rounded-xl px-5 py-6 mb-6 md:h-56 w-full">
                  <h5 className="block text-gray-600 text-xs font-medium">This Company Draws Data From:</h5>
                  {company.dataSources?.map((d) => (
                    <div className="flex items-center justify-between px-0 py-3" key={d.label}>
                      <a href={d.url as string} target="_blank" className="text-primary text-base font-normal">
                        {d.label}
                      </a>
                    </div>
                  ))}
                  {company.dataSources?.length === 0 && (
                    <div className="flex items-center justify-between px-0 py-3">
                      <div className="text-primary text-base font-normal">No data source found</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </ContentFrame>

      <AddFloatingButton>
        <FloatingButtonItem id='company-rating'>
          <Link to={routes.companyRating.build({ companyId: String(id) })} className="flex items-center">
            <HappyFace className="mr-4 text-primary-light" />
            Company Rating
          </Link>
        </FloatingButtonItem>
        {referencePermission?.capabilities.CREATE && (
          <FloatingButtonItem id="reference-create">
            <Link
              to={
                company?.companyType === CompanyType?.CUSTOMER
                  ? routes.addCustomerReference.build(id)
                  : routes.addOpportunityReference.build(id)
              }
              className="flex items-center">
              <AddIcon className="mr-4 text-primary-light" />
              {company?.companyType === CompanyType?.CUSTOMER ? 'Add Reference' : 'Link Reference'}
            </Link>
          </FloatingButtonItem>
        )}
        <FloatingButtonItem onClick={() => findReference()}>
          <span className="flex items-center">
            <SearchIcon className="mr-4 text-primary-light" />
            Find a reference
          </span>
        </FloatingButtonItem>
        {emailPermission?.capabilities.EXECUTE ? (
          <FloatingButtonItem id="launch">
            <Link
              to={`${routes.selectTemplate.build({
                companyId: String(company?.id),
              })}`}
              className="flex items-center">
              <LaunchIcon className="mr-2 text-primary-light" />
              Launch
            </Link>
          </FloatingButtonItem>
        ) : null}
        {notesPermission?.capabilities?.CREATE && (
          <FloatingButtonItem id="note-create">
            <span onClick={() => setIsOpen(true)} className="flex items-center outline-none">
              <NoteIcon className="mr-4 text-primary-light" />
              Note
            </span>
          </FloatingButtonItem>
        )}
      </AddFloatingButton>
      {isOpen && company && (
        <NoteCreateModal
          open={isOpen}
          setOpen={setIsOpen}
          company={{ id: company.id, name: company.name, isStarred: Boolean(company.starredByUser) }}
        />
      )}
    </>
  );
}
