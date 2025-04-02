/* eslint-disable @typescript-eslint/no-unused-vars */
import { FreezeStateInterface } from 'Interface/FreezeStateInterface';
import { MetaDataInterface } from 'Interface/MetaDataInterface';
import { snapActionsApi } from 'Lib/Api/snap-actions-api';
import { toastNetworkError } from 'Lib/Utility/toastNetworkError';

export async function freezeCompilation(
  compilationId: string,
  setFreezeState: React.Dispatch<React.SetStateAction<FreezeStateInterface>>,
   setMetaData : React.Dispatch<React.SetStateAction<MetaDataInterface>>
) {
  try {
    setFreezeState((e) => {
      return {
        ...e,
        loading: true,
      };
    });
    await snapActionsApi.freezeCompilation(compilationId);
    setMetaData((e) => {
      return {
        loading: false,
        data: {
          ...e.data,
          freeze: !e.data?.freeze,
        }
      } as unknown as MetaDataInterface;
    });
  } catch (e: any) {
    toastNetworkError(e);
  } finally {
    setFreezeState((e) => {
      return {
        ...e,
        loading: false,
      };
    });
  }
}
