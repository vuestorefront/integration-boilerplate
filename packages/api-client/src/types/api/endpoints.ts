import { BoilerplateIntegrationContext, TODO } from '..'

/**
 * Definition of all API-client methods available in {@link https://docs.vuestorefront.io/v2/advanced/context.html#context-api | context}.
 */
export interface Endpoints {

  /**
   * Here you can find an example endpoint definition. Based on this example, you should define how your endpoint will look like.
   * This description will appear in the API extractor, so try to document all endpoints added here.
   */
  exampleEndpoint(
    context: BoilerplateIntegrationContext,
    params: TODO
  ): Promise<TODO>;
    getDinner(context: BoilerplateIntegrationContext, params: TODO): Promise<TODO>;
    getSpace(context: BoilerplateIntegrationContext, params: TODO): Promise<TODO>;
    getCategories(context: BoilerplateIntegrationContext, params: TODO): Promise<TODO>;
    getDeck(context: BoilerplateIntegrationContext, params: TODO): Promise<TODO>;
    getYoutube(context: BoilerplateIntegrationContext, params: TODO): Promise<TODO>;
    getX(context: BoilerplateIntegrationContext, params: TODO): Promise<TODO>;
    getXx(context: BoilerplateIntegrationContext, params: TODO): Promise<TODO>;
    getYY(context: BoilerplateIntegrationContext, params: TODO): Promise<TODO>;
}
