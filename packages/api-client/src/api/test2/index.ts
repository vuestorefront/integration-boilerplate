import consola from "consola";
import { BoilerplateIntegrationContext, TODO } from "../../types";

export const test2 = async (
  context: BoilerplateIntegrationContext,
  params: TODO
) => {
  consola.log("test2 has been called");

  return { data: "Hello from test2 endpoint!" };
};
