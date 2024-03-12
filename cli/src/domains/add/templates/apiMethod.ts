import { Template } from "./types";

export const apiMethod: Template = ({ name }) => ({
  path: `packages/api-client/src/api/${name}/index.ts`,
  contents: `import consola from "consola";
import { BoilerplateIntegrationContext, TODO } from "../../types";

export const ${name} = async (
  context: BoilerplateIntegrationContext,
  params: TODO
) => {
  consola.log("${name} has been called");

  return { data: "Hello from ${name} endpoint!" };
};
`,
});
