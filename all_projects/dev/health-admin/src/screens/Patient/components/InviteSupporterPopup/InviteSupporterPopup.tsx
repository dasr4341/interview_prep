/*  */
import React, { useState } from 'react';
import Button from '../../../../components/ui/button/Button';
import Popup from 'reactjs-popup';
import CustomInputField from 'components/Input/CustomInputField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { useParams } from 'react-router';
import {
  InvitationTypes,
  PretaaHealthSubmitSupporter,
  PretaaHealthSubmitSupporterVariables,
  SubmitSupporterByPatient,
  SubmitSupporterByPatientVariables,
  UserTypeRole,
} from 'health-generatedTypes';
import { inviteSupporter } from 'graphql/inviteSupporter.mutation';
import { useMutation } from '@apollo/client';
import catchError, { getGraphError } from 'lib/catch-error';
import { patientInviteSupporterMutation } from 'graphql/patientInviteSupporter.mutation';
import { yupEmailValidation } from 'lib/validation/yup-email-validation';
import useSelectedRole from 'lib/useSelectedRole';
import { Radio } from '@mantine/core';

const facilityTypeClientResolver = yup.object().shape({
  email: yupEmailValidation,
});

const patientTypeClientResolver = yup.object().shape({
  email: yupEmailValidation,
  radio: yup.string().required('The terms and conditions must be accepted.'),
});

export default function InviteSupporterPopup() {
  const isPatient = useSelectedRole({ roles: [UserTypeRole.PATIENT] });
  const isClinician = useSelectedRole({ roles: [UserTypeRole.COUNSELLOR, UserTypeRole.FACILITY_ADMIN, UserTypeRole.SUPER_ADMIN] });

  const { id } = useParams() as { id: string };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [radioValue, setRadioValue] = React.useState('');
  const invitationTypes = Object.values(InvitationTypes);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetFrom,
  } = useForm({
    resolver: yupResolver(isPatient ? patientTypeClientResolver : facilityTypeClientResolver),
  });

  const handleChange = (event) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  // to invite supporter by facility user
  const [getInviteSupporter, { error, data: responseData, loading, reset: responseReset }] = useMutation<
    PretaaHealthSubmitSupporter,
    PretaaHealthSubmitSupporterVariables
  >(inviteSupporter, {
    onCompleted: () => resetFrom(),
    onError: (e) => catchError(e, true)
  });
  // ------------------------------------------------------------------------

  // to invite supporter by patient
  const [patientInviteSupporter, { loading: patientInviteSupporterLoading, data: patientInviteResponse, reset: patientInviteReset }] =
    useMutation<SubmitSupporterByPatient, SubmitSupporterByPatientVariables>(patientInviteSupporterMutation, {
      onCompleted: () => resetFrom(),
      onError: (e) => catchError(e, true),
    });
  // ------------------------------------------------------------------------

  function handleOnClose() {
    setDialogOpen(false);

    // resetting the from
    resetFrom();

    // resetting the api response
    responseReset();
    patientInviteReset();
  }

  function inviteSupporterEmail(data: any) {
    if (isPatient) {
      patientInviteSupporter({
        variables: {
          email: data.email,
          invitationType: data.radio as InvitationTypes,
        },
      });
    } else if (isClinician) {
      getInviteSupporter({
        variables: {
          email: data.email,
          patientId: id,
        },
      });
    }
  }

  return (
    <div>
      <Button
        tabIndex={1}
        className='sm:float-right'
        onClick={() => {
          setDialogOpen(true);
        }}>
        {isPatient && 'Invite'}
        {isClinician && 'Invite Supporter'}
      </Button>

      <Popup
        className='popover-wrap'
        open={dialogOpen}
        closeOnDocumentClick={false}
        contentStyle={{
          width: window.innerWidth < 640 ? '90%' : '600px',
        }}
        modal>
        <>
          {!responseData && !patientInviteResponse && (
            <div className="modal text-center relative" style={{ zIndex: 10000 }}>
              <div className="flex justify-between bg-gray-50 py-7 px-2 md:px-8">
                <div className="text-left sm:text-md text-black font-extrabold">
                  {isPatient ? 'Invite people to Pretaa' : 'Invite Supporter to Pretaa'}
                </div>

                <button
                  tabIndex={1}
                  className="text-blue text-pt-blue-300 cursor-pointer text-sm px-1"
                  onClick={() => handleOnClose()}
                >Cancel</button>
              </div>

              <div className="p-3 md:p-8 md:pt-6">
                <p className="pb-5 text-left text-base font-semibold text-primary">Send to email</p>
                <form onSubmit={handleSubmit(inviteSupporterEmail)}>
                  <CustomInputField
                    tabIndex={1}
                    className="input placeholder-black-500 text-base bg-white"
                    type={'email'}
                    register={register('email')}
                    error={Boolean(errors.email?.message)}
                    label="Enter Email"
                    placeholder={'Enter Email'}
                  />

                  <div className="text-left">{errors.email?.message && <ErrorMessage message={errors.email?.message as string} />}</div>

                  {isPatient && (
                    <Radio.Group
                      name="radio-buttons-group"
                      value={radioValue}
                      onChange={handleChange}>
                      {invitationTypes.map((e) => (
                        <Radio
                          key={e}
                          {...register('radio')}
                          tabIndex={1}
                          label={(e === 'FRIEND_FAMILY' && 'Friends & Family') || (e === 'MEDICAL_FACILITY' && 'Care Team') }
                        />
                      ))}
                    </Radio.Group>
                  )}

                  <div className="text-left">
                    {errors.radio?.message && <ErrorMessage message={'Please select a contact type'} />}
                    {isValid && error && <ErrorMessage message={getGraphError(error.graphQLErrors).join(',')} />}
                  </div>
                  <div className="flex pt-6">
                    <Button tabIndex={1} loading={loading || patientInviteSupporterLoading} disabled={loading || patientInviteSupporterLoading}>
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {(responseData || patientInviteResponse) && (
            <div className="text-left py-7 px-8">
              <p className="font-bold text-md text-black">Your email was sent</p>
              <p className="font-normal text-base text-gray-700 mt-5">
                {responseData?.pretaaHealthSubmitSupporter || patientInviteResponse?.pretaaHealthSubmitSupporterByPatient}
              </p>
              <div className="pt-8">
                <Button onClick={() => handleOnClose()}>Close</Button>
              </div>
            </div>
          )}
        </>
      </Popup>
    </div>
  );
}
