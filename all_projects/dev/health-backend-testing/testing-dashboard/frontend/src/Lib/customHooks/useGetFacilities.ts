/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { facilitiesApi } from 'Lib/Api/Axios/facilities/facilities-api';
import { messageData } from 'Lib/message.lib';
import { FacilityApiResponse } from 'Lib/Api/Axios/facilities/facilities-api.interface';

export default function useGetFacilities({
  onError,
}: {
  onError?: (message: string | null) => void;
}) {
  const [facilities, setFacilities] = useState<{
    data: { value: string; label: string }[] | null;
    loading: boolean;
  }>({ data: null, loading: false });

  const getFacilities = useCallback(async () => {
    try {
      setFacilities({ loading: true, data: null });

      const response = await facilitiesApi.getFacilities<{
        list: FacilityApiResponse[];
      }>();

      const list = response.data.list.map(
        (e: { facilityid: string; name: string }) => ({
          value: e.facilityid,
          label: e.name,
        })
      );
      setFacilities((state) => ({ ...state, data: list }));
      if (onError) {
        onError(null);
      }
    } catch (e: any) {
      if (onError) {
        onError(e?.message || messageData.error.failedToFetch);
      }
      notifications.show({ message: e?.message });
    } finally {
      setFacilities((state) => ({ ...state, loading: false }));
    }
  }, []);

  useEffect(() => {
    if (!facilities.data?.length) {
      getFacilities();
    }
  }, []);

  return {
    ...facilities,
  };
}
