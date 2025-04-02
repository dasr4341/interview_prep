/* eslint-disable react-hooks/exhaustive-deps */
import { notifications } from '@mantine/notifications';
import { axiosClient } from 'Lib/Api/Axios/axiosClient';
import useGetFacilities from 'Lib/customHooks/useGetFacilities';
import { messageData } from 'Lib/message.lib';
import { config } from 'config';
import { useState } from 'react';

export function useSchedulerTestData({ onCompleted, onError }: {
  onCompleted: () => void,
  onError: (message: string | null) => void
}) {
  const [schedulerLoading, setSchedulerLoading] = useState(false);
  const facilities = useGetFacilities({ onError });

  const [chartData, setChartData] = useState<
    {
      data: any[];
      maxLen: number;
      labels: string[];
    }
  >(
    {
      data: [],
      maxLen: 0,
      labels: [],
    });

  const getSchedulerData = async (payload: any) => {
    setSchedulerLoading(true);
    try {
      const response: any = await axiosClient.post(
        config.apiEndPoints.schedulerFrequency,
        payload
      );
      if (!!response.data.chartData.labels.length) {
        onError(null);
        setChartData(
          response.data.chartData
        );
      }
    } catch (e: any) {
      onError(e.message || messageData.error.failedToFetch);
      notifications.show({ message: e.message });
    } finally {
      
      onCompleted();
      setSchedulerLoading(false);
    }
  };
  // -------------------------------------------------

  return {
    facilities,
    getSchedulerData,
    schedulerLoading,
    chartData,
  };
}
