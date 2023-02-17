import axios from 'axios';
import { apiClientFactory } from '@vue-storefront/middleware';
import { MiddlewareConfig } from './index';
import * as apiEndpoints from './api';

const onCreate = (settings: MiddlewareConfig) => {
  const axiosInstance = axios.create();

  return {
    config: settings,
    client: axiosInstance
  };
};

const { createApiClient } = apiClientFactory<any, any>({
  onCreate,
  api: apiEndpoints,
});

export { createApiClient };
