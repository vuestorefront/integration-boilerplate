import fs, { existsSync, promises } from 'fs';
import { createConsola } from 'consola';
import { defineCommand } from 'citty';
import { Project } from 'ts-morph';

function normalizeWindowsPath(input = "") {
  if (!input || !input.includes("\\")) {
    return input;
  }
  return input.replace(/\\/g, "/");
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

const config = {
  integrationName: "boilerplate"
};

const nuxtPageMethod = ({ name }) => ({
  path: `playground/app/pages/methods/${name}.vue`,
  contents: `
  <template>
    <div class="flex justify-center items-center h-screen">
        <div class="p-5 w-96">
            <h1 class="typography-headline-2 font-bold mt-2 mb-4 text-green-500">
                Build something amazing
            </h1>
            <p class="text-gray-50">
              ${config.integrationName}/${name}
            </p>
            <div class="box">
                <!-- <JsonViewer :value="jsonData" copyable boxed sort theme="light"  @onKeyClick="keyClick"/> -->
                <h4 class="text-gray-50">Response</h4>
                <JsonViewer class="min-h-[800px] min-w-[500px]" :value="res" expandDepth="5" expanded copyable boxed sort
                    theme="dark" />
            </div>
            <div class="flex flex-col md:flex-row gap-4 mt-6">
                <SfButton @click="callEndpoint" size="lg"> call </SfButton>
                <SfButton @click="reset" size="lg" variant="secondary" class="bg-white"> reset </SfButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { SfButton } from '@storefront-ui/vue';
import { sdk } from '~/sdk.config';
import { JsonViewer } from "vue3-json-viewer"
import "vue3-json-viewer/dist/index.css";

const res = useState('waiting to call ${name} ...');

async function callEndpoint() {
    const { data } = await sdk.${config.integrationName}.${name}('test');
    res.value = data
}

function reset() {
    res.value = 'waiting to call ${name} ...'
}
<\/script>
`
});

const sdkMethod = ({ name }) => ({
  path: `packages/sdk/src/methods/${name}/index.ts`,
  contents: `import { client } from '../../client';
import { TODO } from '../../types';

/**
 * Method summary - General information about the SDK method, usually a single sentence.
 * 
 * @remarks
 * In this section, we have been adding detailed information such as:
 * * what API middleware endpoint this method is calling,
 * * what SAP OCC API endpoints are being called as a result of using this method,
 * * when this method can be used and when it can\u2019t (e.g. logged-in vs anonymous users),
 * * simply everything what helps with understanding how it works.
 * 
 * @param props
 * Just like our API methods, our SDK connector methods accept a single props parameter which carries relevant sub-properties. Therefore, there isn\u2019t much to be described within that TSDoc section.
 * 
 * @returns
 * Human-friendly information what the SDK methods returns.
 * 
 * @example
 * A short code snippet showing how to use the method. Usually we have more than one @example. We should strive for adding as many examples as possible here, with multiple param configurations.
 */
export async function ${name}(props: TODO) {
  const { data } = await client.post<TODO>('${name}', props);
  return data
}
`
});

const apiMethod = ({ name }) => ({
  path: `packages/api-client/src/api/${name}/index.ts`,
  contents: `import { Endpoints } from '../../types';

export const ${name}: Endpoints['${name}'] = async (
  context,
  params
) => {
  console.log('${name} has been called');

  return { data: 'Hello from ${name} endpoint!' };
};
`
});

function capitalizeFirst(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

const nextPageMethod = ({ name }) => ({
  path: `playground/app/src/pages/methods/${name}.tsx`,
  contents: `import { useState } from 'react';
  import { sdk } from '@/pages/_app';
  import { SfButton } from '@storefront-ui/react';
  import { RenderJson } from '@/components/RenderJson';
  
  export default function Page${capitalizeFirst(name)}() {
    const [data, setData] = useState<null | Object>(null);
  
    const hitExampleMethodApi = async () => {
      const data = await sdk.${config.integrationName}.${name}('test');
  
      setData(data);
    };
  
    return (
      <>
        <main className="flex flex-col items-center py-24 gap-12  text-white">
          <SfButton type="button" onClick={hitExampleMethodApi}>
            Call ${name}
          </SfButton>
  
          <div className="w-[500px] h-min-12 h-auto p-4 bg-gray-900 rounded-md flex items-center justify-center">
            {!data ? 'Click the button' : <RenderJson json={data} />}
          </div>
        </main>
      </>
    );
  }  
`
});

const templates = {
  apiMethod,
  sdkMethod,
  nuxtPageMethod,
  nextPageMethod
};

function getPlaygroundFramework(playgroundPath) {
  const nextConfigPaths = [
    `${playgroundPath}/next.config.js`,
    `${playgroundPath}/next.config.ts`
  ];
  const nuxtConfigPaths = [
    `${playgroundPath}/nuxt.config.ts`,
    `${playgroundPath}/nuxt.config.js`
  ];
  for (let i = 0; i < nextConfigPaths.length; i++) {
    if (fs.existsSync(nextConfigPaths[i])) {
      return "next";
    }
  }
  for (let i = 0; i < nuxtConfigPaths.length; i++) {
    if (fs.existsSync(nuxtConfigPaths[i])) {
      return "nuxt";
    }
  }
  const noFramework = "Could not detect framework. No page will be generated.";
  console.warn(noFramework);
  return noFramework;
}

const writeSDKMethod = async (endpoint) => {
  const sdkMethodPath = `./packages/sdk/src/methods/${endpoint}`;
  const isFileExist = fs.existsSync(sdkMethodPath);
  if (isFileExist) {
    fs.appendFileSync(
      "./packages/sdk/src/methods/index.ts",
      `
export { ${endpoint} } from './${endpoint}';`
    );
  }
};

const writeToTypescriptFile = (path, endpoint) => {
  const fileName = path;
  const endpointName = endpoint;
  const contextType = "BoilerplateIntegrationContext";
  const paramsType = "TODO";
  const returnType = "TODO";
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(fileName);
  const endpointsInterface = sourceFile.getInterface("Endpoints");
  if (!endpointsInterface) {
    console.error(`The "Endpoints" interface was not found in ${fileName}`);
    process.exit(1);
  }
  const existingEndpoint = endpointsInterface.getMethod(endpointName);
  if (existingEndpoint) {
    existingEndpoint.remove();
  }
  endpointsInterface.addMethod({
    name: endpointName,
    parameters: [
      { name: "context", type: contextType },
      { name: "params", type: paramsType }
    ],
    returnType: `Promise<${returnType}>`
  });
  sourceFile.saveSync();
};

const writeApiMethod = async (endpoint) => {
  const apiIndexPath = resolve(`./packages/api-client/src/api/index.ts`);
  const typesMethodPath = resolve("./packages/api-client/src/types/api/endpoints.ts");
  fs.appendFileSync(
    apiIndexPath,
    `
export { ${endpoint} } from './${endpoint}';`
  );
  writeToTypescriptFile(typesMethodPath, endpoint);
};

const consola = createConsola({ fancy: true });
const add = defineCommand({
  meta: {
    name: "add",
    description: "Create a new template file."
  },
  args: {
    cwd: {
      type: "string",
      description: "Current working directory"
    },
    logLevel: {
      type: "string",
      description: "Log level"
    },
    force: {
      type: "boolean",
      description: "Override existing file"
    },
    entity: {
      type: "positional",
      required: true,
      valueHint: "the entity you are adding. e.g. endpoint"
    },
    name: {
      type: "positional",
      required: true,
      valueHint: "name"
    }
  },
  async run(ctx) {
    const entity = ctx.args.entity;
    const name = ctx.args.name;
    ctx.args.cwd || resolve("./playground/app");
    const entityOptions = ["endpoint"];
    if (!entityOptions.includes(entity)) {
      consola.error(
        `Entity ${entity} is not supported. Possible values: ${entityOptions.join(
          ", "
        )}`
      );
      process.exit(1);
    }
    const playgroundPath = resolve("./playground/app");
    const playgroundFramework = getPlaygroundFramework(playgroundPath);
    const isForce = ctx.args.force;
    if (entity === "endpoint") {
      makeTemplate("apiMethod", name, isForce);
      makeTemplate("sdkMethod", name, isForce);
      writeApiMethod(name);
      writeSDKMethod(name);
      if (playgroundFramework === "next") {
        makeTemplate("nextPageMethod", name, isForce);
      }
      if (playgroundFramework === "nuxt") {
        makeTemplate("nuxtPageMethod", name, isForce);
      }
    }
  }
});
async function makeTemplate(template, name, force = false) {
  if (!templates[template]) {
    consola.error(
      `Template ${template} is not supported. Possible values: ${Object.keys(
        templates
      ).join(", ")}`
    );
    process.exit(1);
  }
  if (!name) {
    consola.error("name argument is missing!");
    process.exit(1);
  }
  const res = templates[template]({ name });
  const prettyPath = res.path;
  const path = resolve(res.path);
  if (!force && existsSync(path)) {
    consola.error(`File already exists: ${prettyPath}`);
    consola.box("\u{1F699} beep beep! We did't want to risk overwriting your awesome code. \n To overwrite this path \u261D\uFE0F Use --force");
    process.exit(1);
  }
  const parentDir = dirname(path);
  if (!existsSync(parentDir)) {
    if (template === "page") {
      consola.info("This enables vue-router functionality!");
    }
    await promises.mkdir(parentDir, { recursive: true });
  }
  await promises.writeFile(path, res.contents.trim() + "\n");
  consola.log(`\u{1FA84} Generated a new ${template}`);
}

export { add as default };
