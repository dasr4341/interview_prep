import { FC, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { PretaaGetOpportunity } from 'lib/query/opportunity/get-opportunity';
import { PretaaGetCompanyOpportunity, PretaaGetCompanyOpportunityVariables, PretaaGetCompanyOpportunity_pretaaGetCompanyOpprtunity, UserPermissionNames } from 'generatedTypes';
import { LabeledValue } from 'components/LabeledValue';
import DateFormat from 'components/DateFormat';
import { routes } from 'routes';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import AddFloatingButton, { FloatingButtonItem } from 'components/FloatingButton';
import NoteIcon from 'components/icons/Note';
import LaunchIcon from 'components/icons/launch';
import { differenceInDays } from 'date-fns';
import NoteCreateModal from 'screens/notes/NoteCreateModal';
import { TrackingApi } from 'components/Analytics';
import LockIcon from 'components/icons/LockIcon';
import CurrencyFormat from 'components/CurrencyFormat';
import usePermission from 'lib/use-permission';

export const Loading: FC = () => (
  <div className="ph-item">
    <div className="ph-col-12">
      <div className="ph-row">
        <div className="ph-col-6 big"></div>
        <div className="ph-col-4 empty big"></div>
        <div className="ph-col-2 big"></div>
      </div>
    </div>
  </div>
);


export default function OpportunityDetailsScreen() {
  const params = useParams();
  const emailPermission = usePermission(UserPermissionNames.LAUNCH);
  const notesPermission = usePermission(UserPermissionNames.NOTES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyOpportunityDetail.name,
    });
  }, []);

  const {
    data: opportunity,
    loading,
    error,
  } = useQuery<PretaaGetCompanyOpportunity, PretaaGetCompanyOpportunityVariables>(PretaaGetOpportunity, {
    variables: {
      opportunityId: params.opportunityId as string,
      contactsWhere: {
        isPrimary: {
          equals: true,
        },
      },
      industriesWhere: {
        companyId: { equals: params.companyId },
      },
    },
  });

  const links = [
    {
      title: 'Notes',
      count: opportunity?.pretaaGetCompanyOpprtunity?.noteCount as number,
      link: routes.companyNotes.build(`${params.companyId}`, {
        opportunityId: opportunity?.pretaaGetCompanyOpprtunity?.id,
      }),
      isShow: opportunity?.pretaaGetCompanyOpprtunity?.noteCount ? true : false,
      id: 'notes'
    },
    {
      title: 'Launched',
      isShow: opportunity?.pretaaGetCompanyOpprtunity?.launchCount ? true : false,
      count: opportunity?.pretaaGetCompanyOpprtunity?.launchCount as number,
      link: routes.launchedCompanyList.build({
        companyId: params.companyId,
        opportunityId: opportunity?.pretaaGetCompanyOpprtunity?.id,
      }),
    },
  ];

  const rightLinks = [
    {
      title: 'Products',
      link: routes.products.build(`${opportunity?.pretaaGetCompanyOpprtunity?.company?.id}`, {
        opportunityId: opportunity?.pretaaGetCompanyOpprtunity?.id,
      }),
      error: false,
    },
    {
      title: 'Competitors',
      link: routes.competitors.build(opportunity?.pretaaGetCompanyOpprtunity?.company?.id as unknown as string, {
        opportunityId: opportunity?.pretaaGetCompanyOpprtunity?.id,
      }),
      error: false,
    },
    {
      title: 'Contacts',
      link: routes.companyContacts.build(`${opportunity?.pretaaGetCompanyOpprtunity?.company?.id}`, {
        opportunityId: opportunity?.pretaaGetCompanyOpprtunity?.id,
      }),
      error: false,
    },
  ];

  const linkViews = links
    .filter((items) => items.isShow)
    .map((element) => {
      return (
        <Link
          key={element.title}
          to={element.link}
          className={`flex items-center justify-between px-4 
        py-3 border-b last:border-0 text-primary text-base font-normal
        cursor-pointer`}
        data-test-id={`${element.id}-link`}>
          <div>
            {element.title} {element.count && element.count > 0 ? <span className="text-red-500">({element?.count})</span> : ''}
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
  const isOpen = () => {
    if (opportunity?.pretaaGetCompanyOpprtunity?.isClosed && !opportunity?.pretaaGetCompanyOpprtunity?.isWon) {
      return {
        label: 'Closed - Lost',
        blue: false,
      };
    } else if (opportunity?.pretaaGetCompanyOpprtunity?.isClosed && opportunity?.pretaaGetCompanyOpprtunity?.isWon) {
      return {
        label: 'Closed - Won',
        blue: true,
      };
    } else if (!opportunity?.pretaaGetCompanyOpprtunity?.isClosed && opportunity?.pretaaGetCompanyOpprtunity?.isWon) {
      return {
        label: 'Open - Won',
        blue: true,
      };
    } else {
      return {
        label: 'Open',
        blue: true,
        status: true,
      };
    }
  };


  return (
    <>
      <ContentHeader title="Opportunity Detail"></ContentHeader>
      <ContentFrame>
        {loading && !opportunity && <Loading />}
        {error && <ErrorMessage message={error.message} />}
        {opportunity?.pretaaGetCompanyOpprtunity && (
          <div>
            <div className="bg-white px-5 py-6 mb-6 rounded-2xl grid space-y-4">
              <div className="flex">
                <h4 className="text-primary flex-1 text-md font-bold">{opportunity?.pretaaGetCompanyOpprtunity?.name || 'NA'}</h4>

                <div
                  className={`flex justify-center  items-center 
                  ${isOpen().blue ? 'bg-pt-blue-300' : 'bg-pt-red-800'} rounded-full text-white uppercase h-5 text-xxs p-2 font-bold cursor-pointer my-0.5`}>
                  <span data-test-id="opt-label">{isOpen().label}</span>
                </div>
              </div>
              <hr className="divide-y mb-6" />
              <div className="grid space-y-4">
                <LabeledValue label="Company">
                  <Link
                    data-test-id="company-link"
                    to={routes.companyDetail.build(opportunity?.pretaaGetCompanyOpprtunity?.company.id.toString())}
                    className="text-primary-light underline">
                    {opportunity?.pretaaGetCompanyOpprtunity?.company?.name || 'NA'}
                  </Link>
                </LabeledValue>
              </div>
              <div className="grid md:grid-cols-3 grid-cols-2 space-y-4">
                <div className="mt-4">
                  <LabeledValue label="Pipeline Stage">{opportunity?.pretaaGetCompanyOpprtunity?.pipelineStage?.stageNumber || 'NA'}</LabeledValue>
                </div>
                {isOpen().status && (
                  <LabeledValue label="Days In Stage">
                    {(opportunity?.pretaaGetCompanyOpprtunity?.lastUpdatedOn && differenceInDays(new Date(), new Date(opportunity?.pretaaGetCompanyOpprtunity?.lastUpdatedOn))) ||
                      'NA'}
                  </LabeledValue>
                )}
                <LabeledValue label="Primary Contact">
                  {opportunity?.pretaaGetCompanyOpprtunity?.opportunityContact
                    ?.map((c) => {
                      return `${c.contact.firstName} ${c.contact.lastName}`;
                    })
                    .join(', ') || 'NA'}
                </LabeledValue>
                <LabeledValue label="Industry">
                  {opportunity?.pretaaGetCompanyOpprtunity?.company.companyIndustries?.map(({ industry: { sector } }) => sector).join(', ') || 'NA'}
                </LabeledValue>

                <LabeledValue label={isOpen().status ? 'Expected Close Date' : 'Close Date'}>
                  {isOpen().status && <DateFormat date={String(opportunity?.pretaaGetCompanyOpprtunity?.expectedClose)} />}

                  {!isOpen().status && <DateFormat date={String(opportunity?.pretaaGetCompanyOpprtunity?.closeDate)} />}
                </LabeledValue>

                {isOpen().status && (
                  <LabeledValue label="Potential Revenue">
                    {!opportunity?.pretaaGetCompanyOpprtunity?.potentialArrVal?.hasAccess && <LockIcon className="text-gray-600" />}
                    {opportunity?.pretaaGetCompanyOpprtunity?.potentialArrVal?.hasAccess && (
                      <>{opportunity?.pretaaGetCompanyOpprtunity?.potentialArrVal.data ?
                           <CurrencyFormat price={opportunity?.pretaaGetCompanyOpprtunity?.potentialArrVal.data} /> : 'NA'}</>
                    )}
                  </LabeledValue>
                )}

                <LabeledValue label="Primary Sales Contact">{opportunity?.pretaaGetCompanyOpprtunity?.primarySalesContact?.name || 'NA'}</LabeledValue>
                <LabeledValue label="Primary CS Contact">{opportunity?.pretaaGetCompanyOpprtunity?.primaryCSMContact?.name || 'NA'}</LabeledValue>
              </div>
            </div>
          </div>
        )}
        <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 md:space-x-4 mb-6 w-full">
          {opportunity?.pretaaGetCompanyOpprtunity?.noteCount || opportunity?.pretaaGetCompanyOpprtunity?.launchCount ? (
            <div style={{ height: 'min-content' }} className="w-full bg-white border border-gray-200 rounded-xl">
              {linkViews}
            </div>
          ) : (
            ''
          )}
          <div style={{ height: 'min-content' }} className="w-full bg-white border border-gray-200 rounded-xl">
            {rightLinkView}
          </div>
        </div>
      </ContentFrame>
      {(emailPermission?.capabilities.EXECUTE || notesPermission?.capabilities?.CREATE) && (
      <AddFloatingButton>
        <></>
        {emailPermission?.capabilities.EXECUTE && (
        <FloatingButtonItem id="launch">
          <Link
            to={`${routes.selectTemplate.build({
              companyId: String(opportunity?.pretaaGetCompanyOpprtunity?.company?.id),
              opportunityId: String(params.opportunityId),
            })}`}
            className="flex items-center">
            <LaunchIcon className="mr-2 text-primary-light" />
            Launch
          </Link>
        </FloatingButtonItem>
        )}
        {notesPermission?.capabilities?.CREATE && (
        <FloatingButtonItem id="note-create">
          <span onClick={() => setIsModalOpen(true)} className="flex items-center outline-none">
            <NoteIcon className="mr-4 text-primary-light" />
            Note
          </span>
        </FloatingButtonItem>
        )}
      </AddFloatingButton>
      )}
      {isModalOpen && (
        <NoteCreateModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          opportunityId={params.opportunityId}
          opportunity={opportunity?.pretaaGetCompanyOpprtunity as PretaaGetCompanyOpportunity_pretaaGetCompanyOpprtunity}
        />
      )}
    </>
  );
}
