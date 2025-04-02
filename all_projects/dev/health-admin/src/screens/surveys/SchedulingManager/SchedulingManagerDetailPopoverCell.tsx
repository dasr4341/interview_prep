import React, { useState } from 'react';

import Popover, { PopOverItem } from 'components/Popover';
import { useMutation } from '@apollo/client';
import {
  GetCampaignListByTemplateId_pretaaHealthGetAllCampaignSurveys,
  UserPermissionNames,
  DeleteCampaignSurvey,
  DeleteCampaignSurveyVariables,
  PauseCampaign,
  PauseCampaignVariables,
} from 'health-generatedTypes';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import { ICellRendererParams } from '@ag-grid-community/core';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { deleteAndArchiveCampaign } from 'graphql/deleteAndArchiveCampaign.mutation';
import { pauseCampaignMutation } from 'graphql/pauseCampaign.mutation';
import * as CampaignStatusHelpers from './CampaignStatusHelpers';
import { Campaign } from './SchedulingCamapaign/ScheduleManagerDetailsHelper';

interface CustomScheduleManagerDetail
  extends ICellRendererParams,
    GetCampaignListByTemplateId_pretaaHealthGetAllCampaignSurveys {
      onDelete: (id: string | null) => void
    }

export default function SchedulingManagerPopoverCell(props: CustomScheduleManagerDetail) {
  const data: Campaign = props.data;
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [showDeleteOrArchiveModal, setShowDeleteOrArchiveModal] = useState(false);
  const [showUpdateCampaignModal, setShowUpdateCampaignModal] = useState(false);

  // update campaign
  const [updateCampaignCallBack, { loading: updatePauseCampaignLoadingState }] = useMutation<
    PauseCampaign,
    PauseCampaignVariables
  >(pauseCampaignMutation);

  function updateCampaignStatus() {
    updateCampaignCallBack({
      variables: {
        surveyId: data?.id,
        campaignStatus: data.pause,
      },
      onCompleted: () => {
        setShowUpdateCampaignModal(false);
        toast.success(`Campaign ${data.pause ? 'unpaused' : 'paused'} successfully`);
        callParentMethod();
      },
      onError: (e) => {
        setShowUpdateCampaignModal(false);
        catchError(e, true);
      },
    });
  }

  // to delete and archive campaign
  const [deleteAndArchiveCallBack, { loading: deleteAndArchiveLoading }] = useMutation<
    DeleteCampaignSurvey,
    DeleteCampaignSurveyVariables
  >(deleteAndArchiveCampaign, {
    onCompleted: (d) => {
      if (d.pretaaHealthDeleteCampaignSurvey) {
        setShowDeleteOrArchiveModal(false);
        toast.success(d.pretaaHealthDeleteCampaignSurvey);
      }
      callParentMethod();
    },
    onError: (e) => catchError(e, true),
  });

  function callParentMethod() {
    if (props.context.methodFromParent) {
      props.context.methodFromParent();
    }
  }

  const campaignIsPaused = CampaignStatusHelpers.campaignIsPaused(data.pause);
  const campaignIsPublished = CampaignStatusHelpers.campaignIsPublished(data.published);
  
  const campaignIsInProgress = CampaignStatusHelpers.campaignIsInProgress(data.status);
  const campaignIsEnded = CampaignStatusHelpers.campaignIsEnded(data.status);

  return (
    <>
      <div className="md:inset-y-1/2 right-0 md:transform md:rotate-0  flex items-center justify-end sm:justify-center relative md:static">
        <Popover>
          {campaignIsInProgress && (
            <PopOverItem onClick={() => setShowUpdateCampaignModal(true)}>
              {!campaignIsPaused ? 'Pause' : 'Unpause'}
            </PopOverItem>
          )}
          {useGetPrivilege(UserPermissionNames.CAMPAIGN_SCHEDULER, CapabilitiesType.CREATE) && (
            <>
              <PopOverItem
                onClick={() => navigate(routes.scheduleManagerDetail.duplicateCampaign.build(String(data.id)))}>
                Duplicate
              </PopOverItem>
            </>
          )}

          {useGetPrivilege(UserPermissionNames.CAMPAIGN_SCHEDULER, CapabilitiesType.EDIT) && (
            <PopOverItem onClick={() => navigate(routes.scheduleManagerDetail.editCampaign.build(String(data.id)))}>
              Edit
            </PopOverItem>
          )}

          {useGetPrivilege(UserPermissionNames.CAMPAIGN_SCHEDULER, CapabilitiesType.VIEW) && (campaignIsPublished || campaignIsEnded) && (
            <PopOverItem
              onClick={() =>
                navigate(
                  routes.scheduleManagerDetail.surveyStats.build(String(templateId), String(data.id), {
                    campaignName: data.campaignName,
                  }),
                )
              }>
              View
            </PopOverItem>
          )}
          {campaignIsPublished ? (
            <PopOverItem onClick={() => setShowDeleteOrArchiveModal(true)}>Archive</PopOverItem>
          ) : (
            <PopOverItem onClick={() => setShowDeleteOrArchiveModal(true)}>Delete</PopOverItem>
          )}
        </Popover>
      </div>

      {/* campaign delete or archive modal */}
      <ConfirmationDialog
        modalState={showDeleteOrArchiveModal}
        disabledBtn={deleteAndArchiveLoading}
        confirmBtnText={data.published ? 'Archive' : 'Delete'}
        onConfirm={() =>
          deleteAndArchiveCallBack({
            variables: {
              campaignSurveyId: data.id,
            },
          })
        }
        loading={deleteAndArchiveLoading}
        onCancel={() => setShowDeleteOrArchiveModal(false)}
        className="max-w-sm rounded-xl">
        {campaignIsPublished
          ? 'Are you sure you want to archive this campaign?'
          : 'Are you sure you want to delete this campaign?'}
      </ConfirmationDialog>

      {/* update campaign confirmation modal */}
      <ConfirmationDialog
        modalState={showUpdateCampaignModal}
        disabledBtn={false}
        confirmBtnText={!campaignIsPaused ? 'Pause' : 'Unpause'}
        onConfirm={() => updateCampaignStatus()}
        loading={updatePauseCampaignLoadingState}
        onCancel={() => setShowDeleteOrArchiveModal(false)}
        className="max-w-sm rounded-xl">
        You can {data.pause ? 'unpause' : 'pause'} this campaign if you wish to {data.pause ? 'start' : 'stop'} sending
        Patient <span className="font-bold">{data.campaignName}</span> Assessments. You can
        {data.pause ? ' pause' : ' unpause'} the campaign if you wish to {data.pause ? 'stop' : 'continue'} sending
        Assessments until the campaign end date.
      </ConfirmationDialog>
    </>
  );
}
