import { Loader } from '@googlemaps/js-api-loader';
import { config } from 'config';

export const mapLoader = new Loader({
  apiKey: config.map.apiKey,
  version: 'weekly',
  libraries: ['places'],
});
