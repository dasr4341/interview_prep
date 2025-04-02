/*  */
import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { assessmentEventListQuery } from '../../../../graphql/assessmentEventList.query';
import {
  AssessmentEventList,
  AssessmentEventListVariables,
  AssessmentEventList_pretaaHealthAssessmentEventList,
} from 'health-generatedTypes';
import Popup from 'reactjs-popup';
import { Virtuoso } from 'react-virtuoso';
import { config } from 'config';
import EventRowSkeletonLoading from '../../skeletonLoading/EventRowSkeletonLoading';
import AssessmentRow from './AssessmentRow';

const contentStyle = {
  background: 'transparent',
  border: '0px',
  width: '80%',
  padding: '0px'
};

export default function FilteredEventsAssessmentModal({
  title,
  parentEventId,
  patientId,
  onClose,
}: {
  title?: string;
  parentEventId: string;
  patientId: string;
  onClose?: () => void;
}) {
  const [assessmentList, setAssessmentList] = useState<{
    data: AssessmentEventList_pretaaHealthAssessmentEventList[];
    moreData: boolean;
  }>({
    data: [],
    moreData: true,
  });

  const [getAssessmentData, { loading }] = useLazyQuery<
    AssessmentEventList,
    AssessmentEventListVariables
  >(assessmentEventListQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthAssessmentEventList) {
        setAssessmentList({
          data: assessmentList.data.concat(d.pretaaHealthAssessmentEventList),
          moreData:
            d.pretaaHealthAssessmentEventList.length ===
            config.pagination.defaultTake,
        });
      }
    },
  });

  function callAPIs() {
    if (patientId && parentEventId) {
      getAssessmentData({
        variables: {
          patientId,
          parentEventId,
        },
      });
    }
  }

  const handleEndReach = () => assessmentList.moreData && callAPIs();
  const rowRendererVirtue = (_index: number, e: any) => (
    <AssessmentRow assessment={e}  />
  );
  const footerComponent = () =>
    loading && (
      <>
        <EventRowSkeletonLoading />
        <EventRowSkeletonLoading />
      </>
    );

  useEffect(() => {
    setAssessmentList({
      data: [],
      moreData: true,
    });
    callAPIs();
  }, [parentEventId, patientId]);

  return (
    <Popup
      open={true}
      modal
      {...{ contentStyle }}
      closeOnDocumentClick>
      <section className="xl:w-8/12 flex justify-center items-center m-auto flex-col bg-white">
        <div className=" w-full flex justify-between  p-6  py-12 px-4  md:px-8  items-center">
          <span className=" md:text-lg text-xmd leading-6 md:leading-none font-bold capitalize">
            {title && `${title.replaceAll('_', ' ').toLowerCase()} Assessments`}
          </span>
          <div
            className=" cursor-pointer text-sm text-pt-secondary "
            onClick={() => onClose && onClose()}>
            Cancel
          </div>
        </div>
        <div className='px-4 md:px-8 w-full'>
          <Virtuoso
            style={{ height: '70vh', width: '100%' }}
            data={assessmentList.data}
            endReached={handleEndReach}
            itemContent={rowRendererVirtue}
            components={{ Footer: footerComponent as any }}
          />
        </div>
        
      </section>
    </Popup>
  );
}
