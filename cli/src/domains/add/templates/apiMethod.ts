import { Template } from "./types";

export const apiMethod: Template = ({ name }) => ({
  path: `packages/api-client/src/api/${name}/index.ts`,
  contents: `import { Endpoints } from '../../types';

export const ${name}: Endpoints['${name}'] = async (
  context,
  params
) => {
  console.log('${name} has been called');

  return { data: 'Hello from ${name} endpoint!' };
};
`})
