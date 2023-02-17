import { client } from './client';
import * as methods from './methods';


export const bolierplateSDK = (connectorConfig: { apiUrl: string }) => {
  client.defaults.baseURL = connectorConfig.apiUrl;
  return methods;
};

export * from './types';
export * from './methods';
