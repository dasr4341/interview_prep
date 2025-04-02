/*  */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebouncedState } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';

import { ContentHeader } from 'components/ContentHeader';
import SearchField from 'components/SearchField';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import {
  GetCampaignStandardTemplates,
  GetCampaignStandardTemplatesVariables,
  GetCampaignStandardTemplates_pretaaHealthGetCampaignStandardTemplates,
  SurveyCountPerParticipantType,
  ToggleTemplateStatus,
  ToggleTemplateStatusVariables,
  UserTypeRole,
} from 'health-generatedTypes';
import './_scheduling_manager.scoped.scss';
import { config } from 'config';
import NoDataFound from 'components/NoDataFound';
import catchError from 'lib/catch-error';
import { routes } from 'routes';
import { campaignStandardTemplateList } from 'graphql/campaignStandardTemplateList.query';
import ScheduleManagerListSkeleton from './ScheduleManagerListSkeleton';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { toggleTemplateStatus } from 'graphql/ToggleTemplateStatus.mutation';
import TableVirtuosoReact from 'components/table-virtuoso/TableVirtuosoReact';
import ConfirmationDialog from 'components/ConfirmationDialog';
import messagesData from 'lib/messages';
import useRole from 'lib/useRole';

interface SchedulingManagerInterface {
  data: GetCampaignStandardTemplates_pretaaHealthGetCampaignStandardTemplates[];
  moreData: boolean;
}

function HeaderComponent(isStatusVisible: boolean) {
  return (
    <React.Fragment>
      <tr className="bg-gray-50">
        <td className="row-header font-bold text-base w-1/2 xl:w-3/5 ">
          Template Name
        </td>
        <td className="row-header font-bold text-base w-1/6">Topic</td>
        <td className="row-header font-bold text-base  "># of Campaigns</td>
        {isStatusVisible && (
          <td className="row-header font-bold text-base">Status</td>
        )}
      </tr>
    </React.Fragment>
  );
}

export default function SchedulingManagerList() {
  const navigate = useNavigate();
  const [toggleBtnTemplate, setToggleBtnTemplate] = useState<{
    id: string;
    status: boolean;
  } | null>(null);
  const [searchKeyword, setSearchKeyword] = useDebouncedState('', 700);
  const [scheduledList, setScheduledList] =
    useState<SchedulingManagerInterface>({
      data: [],
      moreData: false,
    });
  const [confirmationModalState, setConfirmationModalState] = useState(false);
  const isFacilityAdmin = useRole({ roles: [ UserTypeRole.FACILITY_ADMIN ] });

  const [getScheduleManagerList, { loading: scheduleManagerLoading }] =
    useLazyQuery<
      GetCampaignStandardTemplates,
      GetCampaignStandardTemplatesVariables
    >(campaignStandardTemplateList, {
      onCompleted: (d) => {
        if (d.pretaaHealthGetCampaignStandardTemplates) {
          setScheduledList({
            moreData:
              d.pretaaHealthGetCampaignStandardTemplates.length >=
              config.pagination.defaultTake,
            data: (!searchKeyword && scheduledList?.data?.length
              ? scheduledList.data
              : []
            ).concat(d.pretaaHealthGetCampaignStandardTemplates),
          });
        }
      },
      onError: (e) => toast.error(catchError(e, true)),
    });

  const [toggleTemplateState, { loading: toggleTemplateLoading }] = useMutation<
    ToggleTemplateStatus,
    ToggleTemplateStatusVariables
  >(toggleTemplateStatus, {
    onCompleted: (d) => {
      if (d.pretaaHealthToggleTemplateStatus) {
        toast.success(d.pretaaHealthToggleTemplateStatus);
        setScheduledList((state) => {
          return {
            ...state,
            data: state.data.map((row) => {
              if (row.id === toggleBtnTemplate?.id) {
                return {
                  ...row,
                  templateEnableStatus: !row.templateEnableStatus,
                };
              }
              return row;
            }),
          };
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  function changeToggleState() {
    if (toggleBtnTemplate?.id) {
      toggleTemplateState({
        variables: {
          templateId: toggleBtnTemplate?.id,
        },
      }).finally(() => setConfirmationModalState(false));
    } else {
      toast.error(messagesData.errorList.toggleBtnNotSelected);
    }
  }

  function rowRendererVirtue(
    index: number,
    data: GetCampaignStandardTemplates_pretaaHealthGetCampaignStandardTemplates,
    isToggleBtnVisible: boolean
  ) {
    return (
      <React.Fragment key={index}>
        <td
          className="row-element text-xsm cursor-pointer leading-5 w-2/5"
          onClick={() => {
            if (isFacilityAdmin) {
              navigate(
                routes.scheduleManagerDetail.listCampaigns.build(
                  String(data.id),
                  SurveyCountPerParticipantType.MULTIPLE,
                  { templateStatus: Boolean(data.templateEnableStatus) }
                )
              );
            } else {
              navigate(
                routes.scheduleManagerDetail.listCampaigns.build(
                  String(data.id),
                  SurveyCountPerParticipantType.MULTIPLE
                )
              );
            }
          }
          }>
          <h2 className="text-pt-secondary font-semibold">{data.name}</h2>
          <p className="text-gray-600 mt-2">{data.description}</p>
        </td>
        <td className="row-element text-normal text-base text-pt-primary w-1/6">
          {data.topic || 'N/A'}
        </td>
        <td className="row-element">{data.totalCampaignCount || 0}</td>
        {isToggleBtnVisible && (
          <td className="row-element ">
            <div className=" flex justify-between items-center">
              <ToggleSwitch
                color="blue"
                disabled={scheduleManagerLoading}
                checked={Boolean(data.templateEnableStatus)}
                onChange={() => {
                  setConfirmationModalState(true);
                  setToggleBtnTemplate({
                    id: String(data.id),
                    status: Boolean(data.templateEnableStatus),
                  });
                }}
              />
              <Link
                className="pl-5"
                to={routes.scheduleManagerDetail.listCampaigns.build(
                  String(data.id),
                  SurveyCountPerParticipantType.MULTIPLE,
                  { templateStatus: Boolean(data.templateEnableStatus) }
                )}>
                <DisclosureIcon />
              </Link>
            </div>
          </td>
        )}
      </React.Fragment>
    );
  }

  function handleEndReach() {
    if (scheduledList.moreData) {
      getScheduleManagerList({
        variables: {
          skip: scheduledList.data.length,
        },
      });
    }
  }

  useEffect(() => {
    setScheduledList({
      moreData: true,
      data: []
    });
    getScheduleManagerList({
      variables: {
        searchPhrase: searchKeyword,
        skip: 0,
        take: config.pagination.defaultTake,
      },
    });
  }, [searchKeyword, location.pathname]);
  
  const footerComponent = () => {
    if (!scheduleManagerLoading) {
      return (
        <React.Fragment>
          <tr className="absolute left-0 right-0">
            <td className="p-4 text-gray-150 text-sm text-center flex justify-center border-0 bg-gray-100">
              No more data
            </td>
          </tr>
        </React.Fragment>
      );
    } else if (!!scheduledList.data?.length && scheduleManagerLoading) {
      return (
        <tr className="absolute left-0 right-0">
          
            <ScheduleManagerListSkeleton numberOfRow={scheduledList.data.length ? 1 : 0} />
        
        </tr>
      );
    }
  }

  return (
    <div className="overflow-hidden">
      <ContentHeader
        className="lg:sticky"
        disableGoBack={true}>
        <div className="block sm:flex sm:justify-between items-start heading-area">
          <div className="header-left w-8/12">
            <h1 className="h1 leading-none text-primary font-bold text-md lg:text-lg mb-5 mt-2">
              Scheduler
            </h1>

            <div className="flex items-center space-x-4 my-3">
              <SearchField
                defaultValue={searchKeyword}
                onChange={(e) => setSearchKeyword(e)}
              />
            </div>
          </div>
        </div>
      </ContentHeader>

      <ContentFrame className="-mt-3">
        {/* for search no data ui */}
        {scheduledList?.data.length === 0 && !scheduleManagerLoading && (
          <div className="flex justify-center items-center min-h-80 md:min-h-70">
            {searchKeyword ? (
              <NoDataFound
                type="SEARCH"
                heading="No results"
                content="Refine your search and try again"
              />
            ) : (
              <NoDataFound
                type="NODATA"
                heading="No Templates available yet"
              />
            )}
          </div>
        )}

        {!!scheduledList?.data.length && (
          <div className="w-full space-y-4 relative">
            <TableVirtuosoReact
              styles={{ height: '70vh' }}
              headerContent={() => HeaderComponent(isFacilityAdmin)}
              itemContent={(d, c) => rowRendererVirtue(d, c, isFacilityAdmin)}
              data={scheduledList.data}
              endReached={handleEndReach}
              loadingState={scheduledList.moreData}
              footer={footerComponent}
            />
          </div>
        )}
        
    {scheduleManagerLoading && scheduledList.data.length === 0 && (
          <ScheduleManagerListSkeleton
            includeHeader={!scheduledList.data.length}
            numberOfRow={6}
          />
        )}
      
      </ContentFrame>
      <ConfirmationDialog
        confirmBtnText="Yes"
        modalState={confirmationModalState}
        onConfirm={changeToggleState}
        disabledBtn={false}
        onCancel={() => setConfirmationModalState(false)}
        className="max-w-sm rounded-xl"
        loading={toggleTemplateLoading}>
        {toggleBtnTemplate?.status
          ? messagesData.successList.surveyTemplateWarning.inActive
          : messagesData.successList.surveyTemplateWarning.active}
      </ConfirmationDialog>
    </div>
  );
}

