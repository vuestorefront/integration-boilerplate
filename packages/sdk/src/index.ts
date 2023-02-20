/**
 * `sdk-connector` for Vue Storefront 2 integration bolierplate.
 *
 * @remarks
 * In here you can find all references to the integration SDK connector.
 *
 * @packageDocumentation
 */

import { client } from './client';
import * as methods from './methods';

export const bolierplateSDK = (connectorConfig: { apiUrl: string }) => {
  client.defaults.baseURL = new URL('boilerplate', connectorConfig.apiUrl).href;
  return methods;
};

export * from './types';
export * from './methods';
