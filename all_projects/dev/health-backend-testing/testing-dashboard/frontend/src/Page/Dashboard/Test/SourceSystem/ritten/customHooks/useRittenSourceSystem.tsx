/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import CellRender from '../components/CellRender';
import { sourceSystemApi } from 'Lib/Api/Axios/sourceSystem/sourceSystemApi';
import {
  RittenDataPayload,
} from 'Lib/Api/Axios/sourceSystem/sourceSystemApi.interface';
import { messageData } from 'Lib/message.lib';
import AgGridCellRender from '../components/AgGridCellRender';
import { ICellRendererParams } from 'ag-grid-community';
import { SourceSystemTypesEnum, config } from 'config';

function getStoredFacilitiesData() {
  const facilitiesFromLocalStorage = localStorage.getItem(
    config.storage.facilityList.rittenFacilityList
  );
  if (facilitiesFromLocalStorage) {
    return { data: JSON.parse(facilitiesFromLocalStorage), loading: false };
  }
  return { data: null, loading: false };
}

export default function useRittenSourceSystem({
  onCompleted,
  onError,
}: {
  onCompleted: () => void;
  onError: (message: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [colDef, setColDef] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<{
    data: { value: string; label: string }[] | null;
    loading: boolean;
  }>(() => getStoredFacilitiesData());

  const getFacilities = async () => {
    try {
      setFacilities({ loading: true, data: null });
      const response = (await sourceSystemApi.getSourceSystemFacilityList(
        SourceSystemTypesEnum.RITTEN
      )) as any;

      const list = response?.data.map((e: { id: string; name: string }) => {
        return {
          value: e.id,
          label: e.name,
        };
      });

      setFacilities((state) => ({ ...state, data: list }));
      localStorage.setItem(
        config.storage.facilityList.rittenFacilityList,
        JSON.stringify(list)
      );
      onError(null);
    } catch (e: any) {
      onError(e?.message || messageData.error.failedToFetch);
    } finally {
      setFacilities((state) => ({ ...state, loading: false }));
    }
  };

  async function getSourceSystemData(data: RittenDataPayload) {
    try {
      setLoading(true);
      const response = await sourceSystemApi.getRittenData(data);
      setRows(response.data.table.rows);
      setColDef(() =>
        response.data.table.cols.map((col) => {
          return {
            ...col,
            rowGroup: col.field.includes('uId'),
            hide: col.field.includes('uId'),
            cellRenderer: (props: ICellRendererParams) =>
              col.isMultiple ? (
                <AgGridCellRender {...props} />
              ) : (
                <CellRender {...{ ...props, colName: col.field }} />
              ),
          };
        })
      );
      onError(null);
      onCompleted();
    } catch (e: any) {
      onError(e?.message || messageData.error.failedToFetch);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!facilities?.data?.length) {
      getFacilities();
    }
  }, []);

  return {
    getFacilities,
    getSourceSystemData,
    facilities,
    tableData: {
      loading,
      rows,
      colDef,
    },
  };
}
