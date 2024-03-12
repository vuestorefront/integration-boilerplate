import consola from "consola";
import { BoilerplateIntegrationContext, TODO } from "../../types";

export const test = async (
  context: BoilerplateIntegrationContext,
  params: TODO
) => {
  consola.log("test has been called");

  return { data: "Hello from test endpoint!" };
};
