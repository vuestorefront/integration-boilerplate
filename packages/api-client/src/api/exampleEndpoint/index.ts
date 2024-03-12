/* eslint-disable @typescript-eslint/no-unused-vars */
import consola from "consola";
import { BoilerplateIntegrationContext, TODO } from "../../types";

/**
 * Example method that is available in the Middleware as an `exampleEndpoint` endpoint.
 * Use it as a reference for your own methods.
 */
export const exampleEndpoint = async (
  context: BoilerplateIntegrationContext,
  params: TODO
) => {
  consola.log("exampleEndpoint has been called");

  // Example request could look like this:
  // return await context.client.get(`example-url?id=${params.id}`);
  return { data: "Hello, Vue Storefront Integrator!" };
};
