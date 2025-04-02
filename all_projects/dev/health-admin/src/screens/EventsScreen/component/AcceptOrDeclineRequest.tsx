import { useMutation } from '@apollo/client';
import { EventListCurrentStateInterface } from 'components/EventOrTimelineView';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { setSupporterStatusMutation } from 'graphql/SetSupporterStatus.mutation';
import {
  EventTypes,
  HealthEventDetails_pretaaHealthEventDetails,
  PatientEventActionTypes,
  SetSupporterStatus,
  SetSupporterStatusVariables,
} from 'health-generatedTypes';
import { getGraphError } from 'lib/catch-error';
import messagesData from 'lib/messages';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { EventDetailsStateInterface } from 'screens/EventDetailsScreen/component/EventDetails';

interface BtnState {
  requestType: PatientEventActionTypes | null;
  loading: boolean;
}

export default function AcceptOrDeclineRequest({
  eventType,
  patientSupporterEventAction,
  eventId,
  updateEventDetails,
  updateEventList,
  className,
}: {
  eventType: EventTypes;
  patientSupporterEventAction: PatientEventActionTypes | null;
  eventId: string;
  updateEventDetails?:React.Dispatch<React.SetStateAction<EventDetailsStateInterface>>;
  updateEventList?: React.Dispatch<React.SetStateAction<EventListCurrentStateInterface>>;
  className?: string;
}) {
  const [btnState, setBtnState] = useState<BtnState>({
    requestType: null,
    loading: false,
  });

  const [setSupporterStatusCallBack, { error: setSupporterStatusError }] = useMutation<SetSupporterStatus, SetSupporterStatusVariables>(
    setSupporterStatusMutation,
    {
      onCompleted: (d) => {
        const updatedTypes = d?.pretaaHealthEventTypeResponse?.patientSupporterEventAction;
        setBtnState({ ...btnState, loading: false });
        if (updatedTypes) {
          toast.success(messagesData.successList.supporterStatusUpdate(updatedTypes));
        } else {
          toast.success(messagesData.errorList.tryAgain);
        }
        // we are using this component in two places
        // 1. event list page ->
        // 2. event details page -> updateEventDetails used to update event details

        // ----------------------- IMPLEMENTING UPDATE OPERATION ----------------

        // ------------------- FOR -> 1. event list page ->
        if (updateEventList) {
          updateEventList((e) => {
            return {
              ...e,
              data: e.data.map((el) => {
                if (el.id === eventId) {
                  return {
                    ...el,
                    patientSupporterEventAction: updatedTypes,
                  };
                }
                return el;
              }),
            };
          });
        }
        //  ------------------- FOR -> 2. event details page ->
        if (updateEventDetails) {
          updateEventDetails((e) => {
            return {
              ...e,
              data: {
                ...e.data,
                patientSupporterEventAction: updatedTypes,
              } as HealthEventDetails_pretaaHealthEventDetails
            };
          });
        }
        // ----------------------------------------------------------------------------
      },
      onError: () => {
        setBtnState({ ...btnState, loading: false });
      },
    }
  );

  if (!patientSupporterEventAction && eventType === EventTypes.REQUESTS) {
    return (
      <div>
        <div className={`flex flex-col sm:flex-row mt-4 sm:space-x-4 ${className}`}>
          <Button
            className='whitespace-nowrap w-fit md:w-auto'
            loading={btnState.requestType === PatientEventActionTypes.ACCEPTED && btnState.loading}
            disabled={btnState.requestType === PatientEventActionTypes.ACCEPTED && btnState.loading}
            onClick={() => {
              setBtnState({ requestType: PatientEventActionTypes.ACCEPTED, loading: true });
              setSupporterStatusCallBack({
                variables: {
                  eventAction: PatientEventActionTypes.ACCEPTED,
                  eventId,
                },
              });
            }}>
            Accept
          </Button>
          <Button
            className='whitespace-nowrap mt-3 sm:mt-0 w-fit md:w-auto'
            loading={btnState.requestType === PatientEventActionTypes.DECLINED && btnState.loading}
            disabled={btnState.requestType === PatientEventActionTypes.DECLINED && btnState.loading}
            onClick={() => {
              setBtnState({ requestType: PatientEventActionTypes.DECLINED, loading: true });
              setSupporterStatusCallBack({
                variables: {
                  eventAction: PatientEventActionTypes.DECLINED,
                  eventId,
                },
              });
            }}
            buttonStyle="danger"
            classes={['border-0']}>
            Decline
          </Button>
        </div>
        {setSupporterStatusError && <ErrorMessage message={getGraphError(setSupporterStatusError.graphQLErrors).join(',')} />}
      </div>
    );
  } else {
    return <></>;
  }
}
