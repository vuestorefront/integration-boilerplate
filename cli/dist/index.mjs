import { defineCommand, runMain } from 'citty';

const _rDefault = (r) => r.default || r;
const commands = {
  add: () => import('./chunks/add.mjs').then(_rDefault),
  call: () => import('./chunks/call.mjs').then(_rDefault)
};

const main = defineCommand({
  meta: {
    name: "vsf",
    version: "1.0.0",
    description: "Integration Boilerplate CLI"
  },
  subCommands: commands,
  async setup(ctx) {
    ctx.args._[0];
  }
});
const runCommand = () => runMain(main);

export { runCommand };
