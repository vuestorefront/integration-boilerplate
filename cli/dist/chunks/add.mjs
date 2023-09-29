import fs, { existsSync, promises } from 'fs';
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

const LogLevels = {
  silent: Number.NEGATIVE_INFINITY,
  fatal: 0,
  error: 0,
  warn: 1,
  log: 2,
  info: 3,
  success: 3,
  fail: 3,
  ready: 3,
  start: 3,
  box: 3,
  debug: 4,
  trace: 5,
  verbose: Number.POSITIVE_INFINITY
};
const LogTypes = {
  // Silent
  silent: {
    level: -1
  },
  // Level 0
  fatal: {
    level: LogLevels.fatal
  },
  error: {
    level: LogLevels.error
  },
  // Level 1
  warn: {
    level: LogLevels.warn
  },
  // Level 2
  log: {
    level: LogLevels.log
  },
  // Level 3
  info: {
    level: LogLevels.info
  },
  success: {
    level: LogLevels.success
  },
  fail: {
    level: LogLevels.fail
  },
  ready: {
    level: LogLevels.info
  },
  start: {
    level: LogLevels.info
  },
  box: {
    level: LogLevels.info
  },
  // Level 4
  debug: {
    level: LogLevels.debug
  },
  // Level 5
  trace: {
    level: LogLevels.trace
  },
  // Verbose
  verbose: {
    level: LogLevels.verbose
  }
};

function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function isLogObj(arg) {
  if (!isPlainObject(arg)) {
    return false;
  }
  if (!arg.message && !arg.args) {
    return false;
  }
  if (arg.stack) {
    return false;
  }
  return true;
}

let paused = false;
const queue = [];
class Consola {
  constructor(options = {}) {
    const types = options.types || LogTypes;
    this.options = defu(
      {
        ...options,
        defaults: { ...options.defaults },
        level: _normalizeLogLevel(options.level, types),
        reporters: [...options.reporters || []]
      },
      {
        types: LogTypes,
        throttle: 1e3,
        throttleMin: 5,
        formatOptions: {
          date: true,
          colors: false,
          compact: true
        }
      }
    );
    for (const type in types) {
      const defaults = {
        type,
        ...this.options.defaults,
        ...types[type]
      };
      this[type] = this._wrapLogFn(defaults);
      this[type].raw = this._wrapLogFn(
        defaults,
        true
      );
    }
    if (this.options.mockFn) {
      this.mockTypes();
    }
    this._lastLog = {};
  }
  get level() {
    return this.options.level;
  }
  set level(level) {
    this.options.level = _normalizeLogLevel(
      level,
      this.options.types,
      this.options.level
    );
  }
  prompt(message, opts) {
    if (!this.options.prompt) {
      throw new Error("prompt is not supported!");
    }
    return this.options.prompt(message, opts);
  }
  create(options) {
    const instance = new Consola({
      ...this.options,
      ...options
    });
    if (this._mockFn) {
      instance.mockTypes(this._mockFn);
    }
    return instance;
  }
  withDefaults(defaults) {
    return this.create({
      ...this.options,
      defaults: {
        ...this.options.defaults,
        ...defaults
      }
    });
  }
  withTag(tag) {
    return this.withDefaults({
      tag: this.options.defaults.tag ? this.options.defaults.tag + ":" + tag : tag
    });
  }
  addReporter(reporter) {
    this.options.reporters.push(reporter);
    return this;
  }
  removeReporter(reporter) {
    if (reporter) {
      const i = this.options.reporters.indexOf(reporter);
      if (i >= 0) {
        return this.options.reporters.splice(i, 1);
      }
    } else {
      this.options.reporters.splice(0);
    }
    return this;
  }
  setReporters(reporters) {
    this.options.reporters = Array.isArray(reporters) ? reporters : [reporters];
    return this;
  }
  wrapAll() {
    this.wrapConsole();
    this.wrapStd();
  }
  restoreAll() {
    this.restoreConsole();
    this.restoreStd();
  }
  wrapConsole() {
    for (const type in this.options.types) {
      if (!console["__" + type]) {
        console["__" + type] = console[type];
      }
      console[type] = this[type].raw;
    }
  }
  restoreConsole() {
    for (const type in this.options.types) {
      if (console["__" + type]) {
        console[type] = console["__" + type];
        delete console["__" + type];
      }
    }
  }
  wrapStd() {
    this._wrapStream(this.options.stdout, "log");
    this._wrapStream(this.options.stderr, "log");
  }
  _wrapStream(stream, type) {
    if (!stream) {
      return;
    }
    if (!stream.__write) {
      stream.__write = stream.write;
    }
    stream.write = (data) => {
      this[type].raw(String(data).trim());
    };
  }
  restoreStd() {
    this._restoreStream(this.options.stdout);
    this._restoreStream(this.options.stderr);
  }
  _restoreStream(stream) {
    if (!stream) {
      return;
    }
    if (stream.__write) {
      stream.write = stream.__write;
      delete stream.__write;
    }
  }
  pauseLogs() {
    paused = true;
  }
  resumeLogs() {
    paused = false;
    const _queue = queue.splice(0);
    for (const item of _queue) {
      item[0]._logFn(item[1], item[2]);
    }
  }
  mockTypes(mockFn) {
    const _mockFn = mockFn || this.options.mockFn;
    this._mockFn = _mockFn;
    if (typeof _mockFn !== "function") {
      return;
    }
    for (const type in this.options.types) {
      this[type] = _mockFn(type, this.options.types[type]) || this[type];
      this[type].raw = this[type];
    }
  }
  _wrapLogFn(defaults, isRaw) {
    return (...args) => {
      if (paused) {
        queue.push([this, defaults, args, isRaw]);
        return;
      }
      return this._logFn(defaults, args, isRaw);
    };
  }
  _logFn(defaults, args, isRaw) {
    if ((defaults.level || 0) > this.level) {
      return false;
    }
    const logObj = {
      date: /* @__PURE__ */ new Date(),
      args: [],
      ...defaults,
      level: _normalizeLogLevel(defaults.level, this.options.types)
    };
    if (!isRaw && args.length === 1 && isLogObj(args[0])) {
      Object.assign(logObj, args[0]);
    } else {
      logObj.args = [...args];
    }
    if (logObj.message) {
      logObj.args.unshift(logObj.message);
      delete logObj.message;
    }
    if (logObj.additional) {
      if (!Array.isArray(logObj.additional)) {
        logObj.additional = logObj.additional.split("\n");
      }
      logObj.args.push("\n" + logObj.additional.join("\n"));
      delete logObj.additional;
    }
    logObj.type = typeof logObj.type === "string" ? logObj.type.toLowerCase() : "log";
    logObj.tag = typeof logObj.tag === "string" ? logObj.tag : "";
    const resolveLog = (newLog = false) => {
      const repeated = (this._lastLog.count || 0) - this.options.throttleMin;
      if (this._lastLog.object && repeated > 0) {
        const args2 = [...this._lastLog.object.args];
        if (repeated > 1) {
          args2.push(`(repeated ${repeated} times)`);
        }
        this._log({ ...this._lastLog.object, args: args2 });
        this._lastLog.count = 1;
      }
      if (newLog) {
        this._lastLog.object = logObj;
        this._log(logObj);
      }
    };
    clearTimeout(this._lastLog.timeout);
    const diffTime = this._lastLog.time && logObj.date ? logObj.date.getTime() - this._lastLog.time.getTime() : 0;
    this._lastLog.time = logObj.date;
    if (diffTime < this.options.throttle) {
      try {
        const serializedLog = JSON.stringify([
          logObj.type,
          logObj.tag,
          logObj.args
        ]);
        const isSameLog = this._lastLog.serialized === serializedLog;
        this._lastLog.serialized = serializedLog;
        if (isSameLog) {
          this._lastLog.count = (this._lastLog.count || 0) + 1;
          if (this._lastLog.count > this.options.throttleMin) {
            this._lastLog.timeout = setTimeout(
              resolveLog,
              this.options.throttle
            );
            return;
          }
        }
      } catch {
      }
    }
    resolveLog(true);
  }
  _log(logObj) {
    for (const reporter of this.options.reporters) {
      reporter.log(logObj, {
        options: this.options
      });
    }
  }
}
function _normalizeLogLevel(input, types = {}, defaultLevel = 3) {
  if (input === void 0) {
    return defaultLevel;
  }
  if (typeof input === "number") {
    return input;
  }
  if (types[input] && types[input].level !== void 0) {
    return types[input].level;
  }
  return defaultLevel;
}
Consola.prototype.add = Consola.prototype.addReporter;
Consola.prototype.remove = Consola.prototype.removeReporter;
Consola.prototype.clear = Consola.prototype.removeReporter;
Consola.prototype.withScope = Consola.prototype.withTag;
Consola.prototype.mock = Consola.prototype.mockTypes;
Consola.prototype.pause = Consola.prototype.pauseLogs;
Consola.prototype.resume = Consola.prototype.resumeLogs;
function createConsola$1(options = {}) {
  return new Consola(options);
}

class BrowserReporter {
  constructor(options) {
    this.options = { ...options };
    this.defaultColor = "#7f8c8d";
    this.levelColorMap = {
      0: "#c0392b",
      // Red
      1: "#f39c12",
      // Yellow
      3: "#00BCD4"
      // Cyan
    };
    this.typeColorMap = {
      success: "#2ecc71"
      // Green
    };
  }
  _getLogFn(level) {
    if (level < 1) {
      return console.__error || console.error;
    }
    if (level === 1) {
      return console.__warn || console.warn;
    }
    return console.__log || console.log;
  }
  log(logObj) {
    const consoleLogFn = this._getLogFn(logObj.level);
    const type = logObj.type === "log" ? "" : logObj.type;
    const tag = logObj.tag || "";
    const color = this.typeColorMap[logObj.type] || this.levelColorMap[logObj.level] || this.defaultColor;
    const style = `
      background: ${color};
      border-radius: 0.5em;
      color: white;
      font-weight: bold;
      padding: 2px 0.5em;
    `;
    const badge = `%c${[tag, type].filter(Boolean).join(":")}`;
    if (typeof logObj.args[0] === "string") {
      consoleLogFn(
        `${badge}%c ${logObj.args[0]}`,
        style,
        // Empty string as style resets to default console style
        "",
        ...logObj.args.slice(1)
      );
    } else {
      consoleLogFn(badge, style, ...logObj.args);
    }
  }
}

function createConsola(options = {}) {
  const consola2 = createConsola$1({
    reporters: options.reporters || [new BrowserReporter({})],
    prompt(message, options2 = {}) {
      if (options2.type === "confirm") {
        return Promise.resolve(confirm(message));
      }
      return Promise.resolve(prompt(message));
    },
    ...options
  });
  return consola2;
}
const consola = createConsola();

const nuxtPageMethod = ({ name }) => ({
  path: `playground/app/pages/methods/${name}.vue`,
  contents: `
  <template>
  <div class="flex justify-center items-center h-screen">
    <div class="p-5 w-96">
      <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
        Let's go
      </p>
      <h1 class="typography-headline-2 md:typography-headline-1 md:leading-[67.5px] font-bold mt-2 mb-4">
        Build something amazing
      </h1>
      <p>
       ${name}()
      </p>
      <div class="box">
        <!-- <JsonViewer :value="jsonData" copyable boxed sort theme="light"  @onKeyClick="keyClick"/> -->
        <h4>Response</h4>
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

const res = useState('waiting to call ${name}() ...');

async function callEndpoint() {
  const { data } = await sdk.boilerplate.${name}('test');
  res.value = data
}

function reset() {
  res.value = 'waiting to call ${name}() ...'
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
  path: `playground/app/pages/methods/${name}.tsx`,
  contents: `import { useState } from 'react';
import { sdk } from '@/pages/_app';
import { SfButton } from '@storefront-ui/react';
import { RenderJson } from '@/components/RenderJson';

export default function Page${capitalizeFirst(name)}() {
  const [data, setData] = useState<null | Object>(null);

  const hitExampleMethodApi = async () => {
    const data = await sdk.boilerplate.${name}('test');

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
  const path = resolve(res.path);
  if (!force && existsSync(path)) {
    consola.error(
      `File exists: ${path} . Use --force to override or use a different name.`
    );
    process.exit(1);
  }
  const parentDir = dirname(path);
  if (!existsSync(parentDir)) {
    consola.info("Creating directory", parentDir);
    if (template === "page") {
      consola.info("This enables vue-router functionality!");
    }
    await promises.mkdir(parentDir, { recursive: true });
  }
  await promises.writeFile(path, res.contents.trim() + "\n");
  consola.info(`\u{1FA84} Generated a new ${template} in ${path}`);
}

export { add as default };
