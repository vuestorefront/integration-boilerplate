import { IntegrationContext } from '@vue-storefront/middleware';
import { AxiosInstance } from 'axios';
import { MiddlewareConfig, ContextualizedEndpoints } from '../index';

/**
 * Runtime integration context, which includes API client instance, settings, and endpoints that will be passed via middleware server.
 * This interface name is starting with `Boilerplate`, but you should use your integration name in here.
 **/
export type BoilerplateIntegrationContext = IntegrationContext<
  AxiosInstance,
  MiddlewareConfig,
  ContextualizedEndpoints
>;

/**
 * Global context of the application which includes runtime integration context.
 **/
export interface Context {
  // This property is named `boilerplate`, but you should use your integration name in here.
  $boilerplate: BoilerplateIntegrationContext;
}
