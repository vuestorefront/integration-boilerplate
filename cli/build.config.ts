import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    inlineDependencies: true,
  },
  entries: ['src/index'],
  externals: [
    'citty',
    'fsevents',
    'node:url',
    'node:buffer',
    'node:path',
    'node:child_process',
    'node:process',
    'node:path',
    'node:os',
  ],
})
