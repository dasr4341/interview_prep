import { config } from 'config';
import { ApiResponse } from './interface/ApiResponse.interface';

export function apiRequest<T>(
  endpoint: string,
  body: { [key: string]: any },
  method: 'GET' | 'POST' = 'POST'
): Promise<ApiResponse<T>> {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`${config.baseUrl}/${endpoint}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      reject(await response.json());
    }

    resolve(await response.json());
  });
}
