import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineDot from '@mui/lab/TimelineDot';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { ICompletionStatus } from './CarPendingDashboard';
import { Tooltip, Button } from '@mui/material';
import Link from 'next/link';
import { FaCircleCheck } from 'react-icons/fa6';
import { CarPendingTimelineLoader } from '../loader/CarPendingTimelineLoader';
import HourGlassAnimation from '@/components/lottie/HourGlassAnimation.json';
import Lottie from 'react-lottie';
import { BsHourglassSplit } from 'react-icons/bs';

export const StatusTimeline = ({
  data,
  loading,
  onComplete,
  disabled,
  approvalFor,
}: {
  data: ICompletionStatus[];
  loading: boolean;
  onComplete: () => void;
  disabled: boolean;
  approvalFor: 'Car' | 'Dealer';
}) => {
  return (
    <div>
      {loading && <CarPendingTimelineLoader />}
      {!loading && (
        <div className=" bg-white lg:p-6 p-4 shadow-lg rounded-3xl">
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
                margin: 0,
              },
              width: '100%',
              padding: 0,
              margin: 0,
            }}
          >
            {data.map((item, index) => (
              <div key={index}>
                <TimelineItem>
                  <TimelineSeparator
                    sx={{
                      '& .MuiTimelineDot-root': {
                        backgroundColor: item.status ? '#2563EB' : '',
                      },
                      '& .MuiTimelineConnector-root': {
                        backgroundColor: item.status ? '#2563EB' : '',
                      },
                    }}
                  >
                    <TimelineConnector
                      className={`${item.status && 'text-blue-600'}`}
                    />
                    <TimelineDot sx={{ padding: '8px' }}>
                      {item.icon}
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '16px', px: 2 }}>
                    <div
                      key={index}
                      className={`flex items-center ${item.info ? '' : 'justify-between'} px-3 py-5 w-full rounded-lg shadow-lg text-medium font-bold ${
                        item.status ? '' : 'bg-gray-100'
                      }`}
                    >
                      <span
                        className={`${
                          item.status ? 'text-blue-600 ' : 'text-gray-700 '
                        }`}
                      >
                        {item.label}
                      </span>
                      <div className={`${item.info ? 'flex-1' : ''}`}>
                        {item.route && (
                          <Link
                            href={item.route && !item.status ? item.route : ''}
                            className={`text-sm font-semibold ${!item.status && !item.isDisable ? 'text-blue-600 hover:cursor-pointer ' : 'text-blue-400 pointer-events-none'}`}
                          >
                            {item.status ? (
                              <FaCircleCheck
                                className="text-green-600"
                                size={25}
                              />
                            ) : (
                              'UPLOAD'
                            )}
                          </Link>
                        )}

                        {item.info && (
                          <div className="w-full flex justify-between items-center relative">
                            <Tooltip title={item.info} placement="bottom-end">
                              <Button
                                sx={{
                                  padding: 0,
                                  margin: 0,
                                  bgcolor: 'transparent',
                                }}
                              >
                                <IoMdInformationCircleOutline
                                  size={25}
                                  className=" text-blue-600 cursor-pointer"
                                />
                              </Button>
                            </Tooltip>
                            {approvalFor === 'Car' && (
                              <>
                                {!data[index - 1].status && (
                                  <BsHourglassSplit className="text-blue-600 text-[26px]" />
                                )}
                                {item.status && (
                                  <FaCircleCheck
                                    className="text-green-600"
                                    size={25}
                                  />
                                )}
                                {!item.status && data[index - 1].status && (
                                  <Lottie
                                    style={{
                                      position: 'absolute',
                                      right: '-28px',
                                      bottom: '-24px',
                                      overflow: 'hidden',
                                      pointerEvents: 'none',
                                    }}
                                    options={{
                                      loop: true,
                                      autoplay: true,
                                      animationData: HourGlassAnimation,
                                      rendererSettings: {
                                        preserveAspectRatio: 'xMidYMid slice',
                                      },
                                    }}
                                    height={80}
                                    width={80}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              </div>
            ))}
          </Timeline>
          <div className=" flex justify-end mt-4 px-4 w-full">
            <button
              onClick={() => onComplete()}
              disabled={disabled}
              className={` ' border text-white font-semibold rounded-md px-4 py-2 text-medium ' ${
                disabled
                  ? 'bg-gray-300 cursor-not-allowed  border-gray-300'
                  : 'border-orange-500 bg-orange-500 cursor-pointer hover:bg-orange-600'
              }`}
            >
              Approve {approvalFor}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
