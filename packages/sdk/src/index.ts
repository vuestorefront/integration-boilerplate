import { boilerplateConnector } from './connector';
import type { Options } from './types';
import type { Module } from '@vsf-enterprise/sdk';

/**
 * Boulerplate module type.
 */
export interface BoilerplateModuleType extends Module {
  /**
   * The connector of the Boilerplate module.
   */
  connector: ReturnType<typeof boilerplateConnector>;
}

/**
 * Boilerplate module.
 */
export const boilerplateModule = (options: Options): BoilerplateModuleType => ({
  connector: boilerplateConnector({
    apiUrl: options.apiUrl,
  }),
  utils: {},
  subscribers: {},
});

export { client } from './client';

export * from './types';
