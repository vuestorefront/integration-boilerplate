import fs from "fs";

export const writeSDKMethod = async (
  endpoint: string,
  isOverwrite: boolean
) => {
  const sdkMethodPath = `./packages/sdk/src/methods/${endpoint}`;
  const isFileExist = fs.existsSync(sdkMethodPath);

  if (isFileExist && isOverwrite) {
    fs.rmSync(sdkMethodPath, { recursive: true });
  }

  if (!isFileExist) {
    fs.appendFileSync(
      "./packages/sdk/src/methods/index.ts",
      `\nexport { ${endpoint} } from './${endpoint}';`
    );
  }
};
