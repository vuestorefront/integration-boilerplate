import fs from "fs";
import { writeToTypescriptFile } from "./writeTypescriptFile";
import { resolve } from 'pathe'

export const writeApiMethod = async (
  endpoint: string,
) => {
  const apiIndexPath = resolve(`./packages/api-client/src/api/index.ts`);
  const typesMethodPath = resolve('./packages/api-client/src/types/api/endpoints.ts');

  fs.appendFileSync(
    apiIndexPath,
    `\nexport { ${endpoint} } from './${endpoint}';`
  );


  writeToTypescriptFile(typesMethodPath, endpoint);
};
