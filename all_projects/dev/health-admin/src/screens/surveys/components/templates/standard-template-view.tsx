import React, { useState } from 'react';
import { routes } from 'routes';
import Popover, { PopOverItem } from 'components/Popover';
import {
  DeleteSurveyTemplate,
  DeleteSurveyTemplateVariables,
  PretaaHealthGetTemplates_pretaaHealthGetTemplates,
  SurveyCountPerParticipantType,
  SurveyTemplateTypes,
  ToggleTemplateStatus,
  ToggleTemplateStatusVariables,
  UserPermissionNames,
  UserTypeRole,
} from 'health-generatedTypes';
import { useNavigate } from 'react-router-dom';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import '../../components/_survey-template.scoped.scss';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { useMutation } from '@apollo/client';
import { deleteSurveyTemplateMutation } from 'graphql/deleteSurveyTemplate.query';
import messagesData from 'lib/messages';
import { toast } from 'react-toastify';
import catchError, { getGraphError } from 'lib/catch-error';
import { SurveyTemplateList } from 'screens/surveys/TemplateForFacilityAdmin/StandardTemplateScreen';
import { toggleTemplateStatus } from 'graphql/ToggleTemplateStatus.mutation';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import useRole from 'lib/useRole';
import { getAppData } from 'lib/set-app-data';

interface TemplateDeleteHelperInterface {
  modalState: boolean;
  templateId?: string;
}

export default function StandardTemplateView({
  template,
  updateHandler,
  duplicateSurvey
}: {
  template: PretaaHealthGetTemplates_pretaaHealthGetTemplates;
  updateHandler: React.Dispatch<React.SetStateAction<SurveyTemplateList>>;
  duplicateSurvey: (id: string) => void;
}) {
  const navigate = useNavigate();

  const [toggleBtn, setToggleBtn] = useState(Boolean(template.templateEnableStatus));
  const [templateDeleteHelper, setTemplateDeleteHelper] = useState<TemplateDeleteHelperInterface>({
    modalState: false,
  });

  const appData = getAppData();
  
  const isAdmin = useRole({ roles: [UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN] });
  const isClinician = useRole({ roles: [UserTypeRole.COUNSELLOR] });
  

  const surveyUpdatePrivilege = useGetPrivilege(UserPermissionNames.SURVEY_TEMPLATES, CapabilitiesType.EDIT);
  const surveyDeletePrivilege = useGetPrivilege(UserPermissionNames.SURVEY_TEMPLATES, CapabilitiesType.DELETE);
  const surveyCreatePrivilege = useGetPrivilege(UserPermissionNames.SURVEY_TEMPLATES, CapabilitiesType.CREATE);

  const [deleteTemplateCallBack, { loading: deleteTemplateLoading, reset: resetDeleteTemplateState }] = useMutation<
    DeleteSurveyTemplate,
    DeleteSurveyTemplateVariables
  >(deleteSurveyTemplateMutation, {
    onCompleted: () => {
      updateHandler((d) => {
        return {
          ...d,
          data: d.data.filter((e) => e.id !== templateDeleteHelper.templateId),
        };
      });
      setTemplateDeleteHelper({ modalState: false });
      toast.success(messagesData.successList.deleteStandardTemplate);
    },
    onError: (e) => toast.error(getGraphError(e.graphQLErrors).join(',')),
  });

  const [toggleTemplateState, { loading: toggleTemplateLoading }] = useMutation<
    ToggleTemplateStatus,
    ToggleTemplateStatusVariables
  >(toggleTemplateStatus, {
    onCompleted: (d) => {
      if (d.pretaaHealthToggleTemplateStatus) {
        updateHandler(prev => {
          return {
            ...prev,
            data: prev.data.map(e => {
              return {
                ...e,
                templateEnableStatus: !template.templateEnableStatus
              }
            })
          }
        });
        toast.success(d.pretaaHealthToggleTemplateStatus);
      }
    },
    onError: (e) => catchError(e, true),
  });

  function deleteTemplate() {
    setTemplateDeleteHelper({
      templateId: String(template.id),
      modalState: true,
    });
    deleteTemplateCallBack({
      variables: { templateId: String(template.id) },
    });
  }

  return (
    <React.Fragment key={template.id}>
      <div className="flex items-center w-full border-b bg-white border-gray-100">
        <div
          className={`row-element cursor-pointer ${
            template.type === SurveyTemplateTypes.STANDARD ? 'w-1/2 2xl:w-2/3' : 'w-7/12'
          }`}
          onClick={() => {
            navigate(
              routes.scheduleManagerDetail.listCampaigns.build(
                String(template.id),
                SurveyCountPerParticipantType.MULTIPLE,
                {
                  templateStatus: Boolean(toggleBtn),
                }
              )
            );
          }}>
          <h3 className="text-pt-secondary font-semibold mb-1">{template.name}</h3>
          <p className="text-gray-600 mt-2">{template.description}</p>
        </div>
        {template.type === SurveyTemplateTypes.STANDARD && (
          <div className="row-element text-normal text-base text-pt-primary w-1/5">
            <span>{template.topic || 'N/A'}</span>
          </div>
        )}
        <div
          className={`row-element flex items-center ${
            template.type === SurveyTemplateTypes.STANDARD ? 'w-1/5' : 'w-5/12 ml-12'
          }`}>
          <span>{template.totalCampaignCount || 0}</span>
        </div>
        {template.type === SurveyTemplateTypes.CUSTOM && Number(appData.selectedFacilityId?.length) > 1 && (
            <div
            className={`row-element flex items-center w-5/12`}>
            <span>{template.facilityName || 'N/A'}</span>
          </div>
        )}
        <div
          className={`${(Number(appData.selectedFacilityId?.length) === 1 && isAdmin) ? 'w-1/12 row-element flex items-center' : ''}`}>
            {isAdmin && appData.selectedFacilityId?.length === 1 && (
              <ToggleSwitch
              loading={toggleTemplateLoading}
              color="blue"
              checked={toggleBtn}
              onChange={() => {
                toggleTemplateState({
                  variables: { templateId: String(template.id) },
                }).finally(() => setToggleBtn(!toggleBtn));
              }}
            />
            )}
          
        </div>

        <div className={`${template.type === SurveyTemplateTypes.STANDARD ? 'pr-5' : 'pr-10 '} flex items-center`}>
          <Popover triggerClass="text-gray-600 focus:text-pt-secondary">
            <PopOverItem onClick={() => navigate(routes.templateFormPreview.build(String(template.id)))}>
              Preview
            </PopOverItem>

            {isClinician && template.templateEnableStatus && (
              <PopOverItem
                onClick={() => navigate(routes.scheduleManagerDetail.scheduleCampaign.build(String(template.id)))}>
                Schedule
              </PopOverItem>
            )}
            {template.templateEnableStatus && (
              <PopOverItem
                onClick={() =>
                  navigate(
                    routes.scheduleManagerDetail.listCampaigns.build(
                      String(template.id),
                      SurveyCountPerParticipantType.MULTIPLE
                    )
                  )
                }>
                Campaigns
              </PopOverItem>
            )}

            {surveyUpdatePrivilege && location.pathname.includes('custom') && (
              <PopOverItem onClick={() => navigate(routes.updateTemplateForm.build(String(template.id)))}>
                Edit
              </PopOverItem>
            )}
            {surveyCreatePrivilege && location.pathname.includes('custom') && (
              <PopOverItem onClick={() => duplicateSurvey(String(template.id))}>Duplicate</PopOverItem>
            )}
            {surveyDeletePrivilege && location.pathname.includes('custom') && (
              <PopOverItem
                onClick={() => {
                  setTemplateDeleteHelper({
                    ...templateDeleteHelper,
                    modalState: true,
                  });
                  resetDeleteTemplateState();
                }}>
                Delete
              </PopOverItem>
            )}
          </Popover>
        </div>

        <ConfirmationDialog
          modalState={templateDeleteHelper.modalState}
          onConfirm={deleteTemplate}
          disabledBtn={false}
          onCancel={() =>
            setTemplateDeleteHelper({
              ...templateDeleteHelper,
              modalState: false,
            })
          }
          className="max-w-sm rounded-xl"
          loading={deleteTemplateLoading}>
          Are you sure you want to delete this custom template?
        </ConfirmationDialog>
      </div>
    </React.Fragment>
  );
}
