import { existsSync, promises as fsp } from 'fs'
import { dirname, resolve } from 'pathe'
import { consola } from 'consola'
import { templates } from '../utils/templates'
import { defineCommand } from 'citty'

export default defineCommand({
  meta: {
    name: 'add',
    description: 'Create a new template file.',
  },
  args: {
    cwd: {
      type: 'string',
      description: 'Current working directory',
    },
    logLevel: {
      type: 'string',
      description: 'Log level',
    },
    force: {
      type: 'boolean',
      description: 'Override existing file',
    },
    template: {
      type: 'positional',
      required: true,
      valueHint: Object.keys(templates).join('|'),
    },
    name: {
      type: 'positional',
      required: true,
      valueHint: 'name',
    },
  },
  async run(ctx) {
    const cwd = resolve('./playground/app')

    const template = ctx.args.template
    const name = ctx.args.name

    // Validate template name
    if (!templates[template]) {
      consola.error(
        `Template ${template} is not supported. Possible values: ${Object.keys(
          templates,
        ).join(', ')}`,
      )
      process.exit(1)
    }

    // Validate options
    if (!name) {
      consola.error('name argument is missing!')
      process.exit(1)
    }

 

    // Resolve template
    const res = templates[template]({ name, args: ctx.args })

    // Resolve full path to generated file
    const path = resolve('./playground/app', res.path)

    // Ensure not overriding user code
    if (!ctx.args.force && existsSync(path)) {
      consola.error(
        `File exists: ${path} . Use --force to override or use a different name.`,
      )
      process.exit(1)
    }

    // Ensure parent directory exists
    const parentDir = dirname(path)
    if (!existsSync(parentDir)) {
      consola.info('Creating directory', parentDir)
      if (template === 'page') {
        consola.info('This enables vue-router functionality!')
      }
      await fsp.mkdir(parentDir, { recursive: true })
    }

    // Write file
    await fsp.writeFile(path, res.contents.trim() + '\n')
    consola.info(`🪄 Generated a new ${template} in ${path}`)
  },
})
