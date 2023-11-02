import { defineCommand, runMain } from "citty";
import {commands} from "./commands"

const main = defineCommand({
  meta: {
    name: "vsf",
    version: "1.0.0",
    description: "Integration Boilerplate CLI",
  },
  subCommands: commands,
  async setup(ctx) {
    const command = ctx.args._[0];
    
  }
});

export const runCommand = () =>runMain(main);
