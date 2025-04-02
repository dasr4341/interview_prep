import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import DeleteIcon from 'components/icons/DeleteIcon';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import {
  OwnerChangeTemplateStatus,
  OwnerChangeTemplateStatusVariables,
  OwnerDeleteSurveyTemplate,
  OwnerDeleteSurveyTemplateVariables,
  OwnerGetTemplates_pretaaHealthAdminGetTemplates,
} from 'health-generatedTypes';
import { useMutation } from '@apollo/client';
import { OwnerDeleteSurveyTemplateMutation } from 'graphql/OwnerDeleteSurveyTemplate.mutation';
import { toast } from 'react-toastify';
import messagesData from 'lib/messages';
import catchError, { getGraphError } from 'lib/catch-error';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { OwnerTemplateListStateInterface } from '../SurveyList';
import { ownerChangeTemplateStatusMutation } from 'graphql/ownerChangeTemplateStatus.mutation';

export default function SurveyListTemplate({
  templateData,
  updateListHandler,
}: {
  updateListHandler: React.Dispatch<React.SetStateAction<OwnerTemplateListStateInterface>>;
  templateData: OwnerGetTemplates_pretaaHealthAdminGetTemplates;
}) {
  const [confirmationModalState, setConfirmationModalState] = useState(false);

  // DELETE TEMPLATE
  const [deleteTemplateCallBack, { loading: deleteTemplateLoading }] = useMutation<
    OwnerDeleteSurveyTemplate,
    OwnerDeleteSurveyTemplateVariables
  >(OwnerDeleteSurveyTemplateMutation, {
    onCompleted: (d) => {
      if (d?.pretaaHealthAdminDeleteSurveyTemplate) {
        toast.success(messagesData.successList.deleteStandardTemplate);
        if (updateListHandler) {
          updateListHandler((e) => {
            return {
              ...e,
              data: e.data.filter((ele) => ele.id !== templateData.id),
            };
          });
        }
        setConfirmationModalState(false);
      }
    },
    onError: (e) => {
      toast.error(getGraphError(e.graphQLErrors).join(','));
    },
  });

  // CHANGE STATUS
  const [changeTemplateStatusCallBack, { loading: changeTemplateStatusLoading }] = useMutation<
    OwnerChangeTemplateStatus,
    OwnerChangeTemplateStatusVariables
  >(ownerChangeTemplateStatusMutation, {
    onCompleted: (d) => {
      if (d?.pretaaHealthAdminChangeTemplateStatus) {
        toast.success(messagesData.successList.changeStatusStandardTemplate);
        updateListHandler((e) => {
          return {
            ...e,
            data: e.data.map((ele) => {
              if (ele.id === templateData.id) {
                return {
                  ...ele,
                  status: String(templateData.status).toLowerCase() === 'true' ? 'false' : 'true',
                };
              }
              return ele;
            }),
          } as OwnerTemplateListStateInterface;
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  return (
    <div className="flex py-6 px-5 border-b border-gray-100 bg-white items-center">
      <div className="flex-1 pr-2">
        <Link to={routes.owner.surveyDetails.details.build(String(templateData.id))}>
          <h3 className="font-bold text-base text-pt-blue-900">{templateData.name}</h3>
          <p className="text-gray-600 text-base font-normal">{templateData.description}</p>
        </Link>
      </div>
      <div className={`pr-5 ${changeTemplateStatusLoading && 'cursor-wait'}`}>
        <ToggleSwitch
          checked={String(templateData.status).toLowerCase() === 'true'}
          color="blue"
          onChange={() => {
            if (!changeTemplateStatusLoading) {
              changeTemplateStatusCallBack({
                variables: {
                  templateId: String(templateData.id),
                },
              });
            }
          }}
        />
      </div>
      <div className='hidden'>
        <button className={`${deleteTemplateLoading && 'cursor-wait'}`} onClick={() => setConfirmationModalState(true)}>
          <DeleteIcon className="w-4 text-gray-600" />
        </button>
      </div>
      <ConfirmationDialog
        modalState={confirmationModalState}
        disabledBtn={deleteTemplateLoading}
        loading={deleteTemplateLoading}
        onConfirm={() =>
          !deleteTemplateLoading &&
          deleteTemplateCallBack({
            variables: {
              templateId: String(templateData.id),
            },
          })
        }
        onCancel={() => setConfirmationModalState(false)}
        className="max-w-sm rounded-xl">
        Are you sure you want to delete this standard template?
      </ConfirmationDialog>
    </div>
  );
}
