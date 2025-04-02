/*  */
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Popover, { PopOverItem } from 'components/Popover';
import { routes } from 'routes';
import { AssessmentDetails } from './assessment-template-interface';
import { useMutation } from '@apollo/client';
import { assessmentArchiveForCounsellor } from 'graphql/assessmentArchiveForCounsellor.mutation';
import {
  AssessmentArchieveForCounsellors,
  AssessmentArchieveForCounsellorsVariables,
} from 'health-generatedTypes';
import { toast } from 'react-toastify';
import { ICellRendererParams } from '@ag-grid-community/core';
import catchError from 'lib/catch-error';
import ConfirmationDialog from 'components/ConfirmationDialog';

interface AssessmentTemplatePopup
  extends ICellRendererParams,
    AssessmentDetails {
      onDelete: (id: string | null) => void
    }

export default function AssessmentTemplateDetailsPopover(
  props: AssessmentTemplatePopup
) {
  const data: AssessmentDetails = props.data;
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );

  // to archive or delete campaign
  const [archiveCallBack, { loading: archiveLoading }] = useMutation<
    AssessmentArchieveForCounsellors,
    AssessmentArchieveForCounsellorsVariables
  >(assessmentArchiveForCounsellor, {
    onCompleted: (d) => {
      if (d.pretaaHealthSurveyArchiveForCounsellors) {
        toast.success(d.pretaaHealthSurveyArchiveForCounsellors);
        props.onDelete(data.surveyId);
      }
      setSelectedCampaignId('');
    },
    onError: (e) => catchError(e, true),
  });

  return (
    <>
      <div className="md:inset-y-1/2 right-0 md:transform md:rotate-0 flex items-center ml-8 relative md:static">
        <Popover>
          <PopOverItem
            onClick={() =>
              navigate(
                routes.assessmentScheduleDuplicateCampaign.build(
                  String(templateId),
                  String(props.data.surveyId)
                )
              )
            }>
            Duplicate
          </PopOverItem>

          {props.data.published === 'No' && (
            <PopOverItem
              onClick={() =>
                navigate(
                  routes.assessmentScheduleEditCampaign.build(
                    String(templateId),
                    String(props.data.surveyId)
                  )
                )
              }>
              Edit
            </PopOverItem>
          )}
          {props.data.published  === 'Yes' ? (
            <PopOverItem onClick={() => setSelectedCampaignId(data.surveyId)}>
              Archive
            </PopOverItem>
          ) : (
            <PopOverItem onClick={() => setSelectedCampaignId(data.surveyId)}>
              Delete
            </PopOverItem>
          )}
        </Popover>
      </div>

      {/* campaign archive or delete modal */}
      <ConfirmationDialog
        modalState={Boolean(selectedCampaignId)}
        disabledBtn={false}
        confirmBtnText={props.data.published === 'Yes' ? 'Archive' : 'Delete'}
        onConfirm={() =>
          archiveCallBack({
            variables: {
              surveyId: String(data.surveyId),
            },
          })
        }
        loading={archiveLoading}
        onCancel={() => setSelectedCampaignId(null)}
        className="max-w-sm rounded-xl">
        {props.data.published === 'Yes'
          ? 'Are you sure you want to archive this assessment?'
          : ' Are you sure you want to delete this assessment?'}
      </ConfirmationDialog>
    </>
  );
}
