import fs from "fs";
import { resolve } from "pathe";

export const writeApiMethod = async (endpoint: string) => {
  const apiIndexPath = resolve(`./packages/api-client/src/api/index.ts`);

  fs.appendFileSync(
    apiIndexPath,
    `export { ${endpoint} } from "./${endpoint}";\n`
  );
};
