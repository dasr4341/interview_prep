import { MetaDataInterface } from 'Interface/MetaDataInterface';
import { snapActionsApi } from 'Lib/Api/snap-actions-api';
import { toastNetworkError } from 'Lib/Utility/toastNetworkError';

  // to get the meta data
 export async function getCompilationMetaData(id: string, setCompilationMetaData: React.Dispatch<React.SetStateAction<MetaDataInterface>>) {
    setCompilationMetaData({ loading: true });
    try {
      const response = await snapActionsApi.getCompilationMetaData(id);
      setCompilationMetaData({
        loading: false,
        data: response,
      });
    } catch (e: any) {
      setCompilationMetaData({
        loading: false,
      });
       toastNetworkError(e);
    }
  }
  // --------------------------------------------