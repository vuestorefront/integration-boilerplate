import 'fs';
import 'consola';
import { defineCommand } from 'citty';

const call = defineCommand({
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
    endpoint: {
      type: "positional",
      required: true,
      valueHint: "name"
    }
  },
  async run(ctx) {
    const endpoint = ctx.args.endpoint;
    console.log("todo: make a call" + endpoint);
  }
});

export { call as default };
