import { apiConfig } from './api-client';

import { TilesInterface } from 'Interface/Tiles';
import { AddCaptionInterface } from 'Interface/AddCaption';
import { DeleteCaptionPayload } from 'Interface/DeleteCaption';
import { LoginInterface } from 'Interface/loginInterface';

export const snapActionsApi = {
  getCaptionList: async () => {
    const response = await apiConfig.get('/captions');
    return response.data;
  },
  createCompilation: async (data: { show_id?: number; name: string }) => {
    const response = await apiConfig.post('/compilations/', data);
    return response.data;
  },
  createTiles: async (data: TilesInterface[]) => {
    const response = await apiConfig.post('tiles/', data);
    return response.data;
  },
  getCompilationList: async () => {
    const response = await apiConfig.get('compilations/');
    return response.data;
  },
  getCompilationDetails: async (id: number) => {
    const response = await apiConfig.get(`compilations/${id}`);
    return response;
  },
  getTileDetails: async (id: number) => {
    const response = await apiConfig.get(`tiles/?compilation_id=${id}`);
    return response.data;
  },
  downloadReport: async (id: number) => {
    const { data } = await apiConfig.get(`compilations/${id}/report`, {
      headers: {
        Accept: 'text/csv',
      },
    });
    return data;
  },
  addCaption: async (data: AddCaptionInterface) => {
    const response = await apiConfig.post('captions/', data);
    return response.data;
  },
  deleteCaption: async (id: string, data: DeleteCaptionPayload) => {
    const response = await apiConfig.delete(`captions/${id}`, { data });
    return response.data;
  },
  deleteTiles: async (id: number) => {
    const response = await apiConfig.delete(`tiles/${id}`);
    return response.data;
  },
  getDropDown: async () => {
    const response = await apiConfig.get('shows/');
    return response.data;
  },
  userLogin: async (loginData: LoginInterface) => {
    const response = await apiConfig.post('auth/jwt', loginData);
    return response.data;
  },
  refreshToken: async (refreshToken: string) => {
    const response = await apiConfig.post('auth/jwt/refresh',  { refresh : refreshToken });
    return response.data;
  },
  getCompilationMetaData: async (compilationId: string) => {
    const response = await apiConfig.get(`compilations/${compilationId}`);
    return response.data;
  },
  archiveCompilation: async (compilationId: string) => {
    const response = await apiConfig.post(`compilations/${compilationId}/archive`);
    return response.data;
  },
  freezeCompilation: async (compilationId: string) => {
    const response = await apiConfig.post(`compilations/${compilationId}/freeze`);
    return response.data;
  },
};
