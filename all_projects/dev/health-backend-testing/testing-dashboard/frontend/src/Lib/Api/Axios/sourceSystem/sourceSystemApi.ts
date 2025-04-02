import { SourceSystemTypesEnum, config } from 'config';
import { axiosClient } from '../axiosClient';
import { GetKipuDataApiResponse, RittenDataPayload, GetKipuDataPayload, SourceSystemFacilityList } from './sourceSystemApi.interface';

export const sourceSystemApi = {
  getKipuData: (payload: GetKipuDataPayload): Promise<GetKipuDataApiResponse> => {
      return axiosClient.post(`${config.apiEndPoints.sourceSystem}${SourceSystemTypesEnum.KIPU}`, payload);
  },
  getRittenData: (payload: RittenDataPayload): Promise<GetKipuDataApiResponse> => {
    return axiosClient.post(`${config.apiEndPoints.sourceSystem}${SourceSystemTypesEnum.RITTEN}`, payload);
  },
  getSourceSystemFacilityList: (sourceSystemType: SourceSystemTypesEnum): Promise<SourceSystemFacilityList[]> => {
    return axiosClient.get(`${config.apiEndPoints.sourceSystemFacilityList}${sourceSystemType}`);
  }
  };
  