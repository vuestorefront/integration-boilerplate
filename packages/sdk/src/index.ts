import { client } from './client';
import * as methods from './methods';

export const bolierplateSDK = (connectorConfig: { apiUrl: string }) => {
  client.defaults.baseURL = new URL('boilerplate', connectorConfig.apiUrl).href;
  return methods;
};

export * from './types';
export * from './methods';
