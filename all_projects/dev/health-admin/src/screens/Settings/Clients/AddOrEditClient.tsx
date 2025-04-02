/*  */
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { toast } from 'react-toastify';

import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import Button from 'components/ui/button/Button';
import messagesData from 'lib/messages';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { ownerCreateMutation } from 'graphql/ownerCreateAccount.mutation';
import catchError from 'lib/catch-error';
import SpaceOnly from 'lib/form-validation/space-only';
import {
  AdminInviteSuperAdmin,
  AdminInviteSuperAdminVariables,
  AdminUpdateClient,
  AdminUpdateClientVariables,
  AdminViewClient,
  AdminViewClientVariables,
  OwnerCreate,
  OwnerCreateVariables,
} from 'health-generatedTypes';
import { updateClient } from 'graphql/updateClient.mutation';
import { viewClientDetails } from 'graphql/viewClient.query';
import TextInputFields from 'components/TextInputFields';
import AddOrEditClientSkeletonLoading from './skeletonLoading/AddOrEditClientSkeletonLoading';
import useQueryParams from 'lib/use-queryparams';
import { clientSendInvitation } from 'graphql/clientSendInvitation.mutation';
import { SendInvitationType } from './lib/ClientManagementHelper';
import { pretaaAdminRoutes } from 'router/pretaa-admin';


const clientResolver = yup.object().shape({
  name: yup.string().transform(SpaceOnly).typeError(messagesData.errorList.required),
  firstName: yup.string().transform(SpaceOnly).typeError(messagesData.errorList.required),
  lastName: yup.string().transform(SpaceOnly).typeError(messagesData.errorList.required),
  email: yup
    .string()
    .email(messagesData.errorList.email)
    .transform(SpaceOnly)
    .typeError(messagesData.errorList.required)
});

interface ClientFormFields {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function AddOrEditClient() {
  // in case of edit client -> clientId
  const query = useQueryParams();
  const { clientId, id } = useParams();
  const navigate = useNavigate();
  const isSendInvitationPage = location.pathname.includes(pretaaAdminRoutes.owner.sendInvitation.matchPath as string);


  const {
    register,
    handleSubmit,
    setValue,
    reset: formReset,
    formState: { errors },
  } = useForm<ClientFormFields>({
    resolver: yupResolver(clientResolver),
  });

  // create client
  const [createClientCallBack, { loading: createFormLoading }] = useMutation<
    OwnerCreate,
    OwnerCreateVariables
  >(ownerCreateMutation);

  const [sendInvitationToSuperAdmin, { loading: sendingInvitationLoading }] = useMutation<
  AdminInviteSuperAdmin,
  AdminInviteSuperAdminVariables
>(clientSendInvitation);

  // edit client
  const [editClientCallBack, { loading: updateFormLoading }] = useMutation<AdminUpdateClient, AdminUpdateClientVariables>(updateClient);

  // client view
  const [clientDetail, { loading: clientDetailLoadingState }] = useLazyQuery<AdminViewClient, AdminViewClientVariables>(viewClientDetails, {
    onCompleted: (data) => {
      if (data.pretaaHealthAdminViewClient) {
        const val = data.pretaaHealthAdminViewClient;
        if(isSendInvitationPage){
          setValue('firstName', val.superAdmin?.firstName || '');
          setValue('lastName', val.superAdmin?.lastName || '');
          setValue('email', val.superAdmin?.email || '');
        }
        else{
          setValue('name', val.name || '');
        }
      }
    }
  });


  useEffect(() => {
    if (clientId) {
      clientDetail({
        variables: {
          accountId: clientId,
        },
      });
    }
    // 
  }, [clientId]);

  function handleSendInvitation(clientData: SendInvitationType) {
    sendInvitationToSuperAdmin({
      variables: {
          accountId: String(id),
          email: String(clientData.email),
          firstName: String(clientData.firstName),
          lastName: String(clientData.lastName)
      },
      onCompleted: () => {
        toast.success(messagesData.successList.invitationSent);
        formReset();
        navigate(routes.owner.clientManagement.match);
      },
      onError: (e) => {
        formReset();
        catchError(e, true)
      },
    });
  }

  async function submitClientDetails(clientData: SendInvitationType) {
     if(isSendInvitationPage) {
      handleSendInvitation(clientData)
     }
    if (clientId) {
      editClientCallBack({
        variables: {
          accountId: clientId,
          name: String(clientData.name),
        },

        onCompleted: () => {
          toast.success(messagesData.successList.ownerEdited);
          formReset();
          navigate(routes.owner.clientManagement.match);
        },
        onError: (e) => {
          formReset();
          catchError(e, true)
        },
      });
    } else if (!isSendInvitationPage && !clientId) {
      createClientCallBack({
        variables: {
          name: String(clientData.name)
        },
        onCompleted: () => {
          toast.success(messagesData.successList.ownerCreated);
          formReset();
          navigate(routes.owner.clientManagement.match);
        },
        onError: (e) => {
          formReset();
          catchError(e, true)
        },
      });
    }
  }

  function getClientTitle() {
    if (isSendInvitationPage) {
      return query.clientName as string;
    } else if (clientId) {
      return 'Edit Client';
    } 
    return 'Add New Client';
  }

  return (
    <>
      <ContentHeader title={getClientTitle()} />
      <ContentFrame className="h-screen overflow-auto">
        <div className="h-full lg:h-auto w-11/12 md:w-1/2 mx-auto">
          {clientDetailLoadingState && <AddOrEditClientSkeletonLoading/>}
          {!clientDetailLoadingState &&
           <form className='h-full flex flex-col justify-between'
            onSubmit={handleSubmit(submitClientDetails)}
            noValidate>
          <div>
            {!isSendInvitationPage && (
                 <div className="mb-6">
                 <label htmlFor="name" className="block mb-2 text-xsm font-normal text-gray-750 ">
                   Client Name
                 </label>
                 <TextInputFields
                   className='h-12 md:h-14'
                   type="text"
                   register={register('name')}
                   placeholder="Client name"
                 />
                 {errors.name?.message && <ErrorMessage message={errors.name?.message} />}
               </div>
            )}

             {(isSendInvitationPage) && (
              <>
                  <div className="mb-6">
              <label htmlFor="firstName" className="block mb-2 text-xsm font-normal text-gray-750">
                Super Admin First Name
              </label>
              <TextInputFields
                className='h-12 md:h-14'
                type="text"
                register={register('firstName')}
                placeholder="Super admin first name"
              />
              {errors.firstName?.message && <ErrorMessage message={errors.firstName.message} />}
            </div>
            <div className="mb-6">
              <label htmlFor="lastName" className="block mb-2 text-xsm font-normal text-gray-750">
                Super Admin Last Name
              </label>
              <TextInputFields
                className='h-12 md:h-14'
                type="text"
                register={register('lastName')}
                placeholder="Super admin last name"
              />
              {errors.lastName?.message && <ErrorMessage message={errors.lastName.message} />}
            </div>
            <div className="mb-16">
              <label htmlFor="email" className="block mb-2 text-xsm font-normal text-gray-750">
                Super Admin Email
              </label>

              <TextInputFields
                className='h-12 md:h-14'
                type="email"
                register={register('email')}
                placeholder="Super admin email"
              />
              
              {errors.email?.message && <ErrorMessage message={errors.email.message} />}
            </div>
              </>
            )}

          </div>
          
            <Button
              loading={createFormLoading || updateFormLoading || sendingInvitationLoading}
              disabled={createFormLoading || updateFormLoading || sendingInvitationLoading}
              classes={'w-full font-medium'}>
              {isSendInvitationPage ? 'Save & Invite' : 'Save'}
            </Button>
          </form>}

        </div>
      </ContentFrame>
    </>
  );
}
