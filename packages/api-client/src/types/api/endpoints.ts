import { BoilerplateIntegrationContext, TODO } from '..'

/**
 * Definition of all API-client methods available in {@link https://docs.vuestorefront.io/v2/advanced/context.html#context-api | context}.
 */
export interface Endpoints {
  exampleEndpoint(
    context: BoilerplateIntegrationContext,
    params: TODO
  ): Promise<TODO>;
}
