import { existsSync, promises as fsp } from 'fs'
import { dirname, resolve } from 'pathe'
import { consola } from 'consola'
import { templates } from '../utils/templates'
import { defineCommand } from 'citty'
import { getPlaygroundFramework } from '../utils/getPlaygroundFramework'
import { writeToTypescriptFile } from '../utils/writeTypescriptFile'
import { writeSDKMethod } from '../utils/writeSdkMethod'

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
    entity: {
      type: 'positional',
      required: true,
      valueHint: 'the entity you are adding. e.g. endpoint',
    },
    name: {
      type: 'positional',
      required: true,
      valueHint: 'name',
    },
  },
  async run(ctx) {
    const entity = ctx.args.entity
    const name = ctx.args.name
    const cwd = ctx.args.cwd || resolve('./playground/app')

    const entityOptions = ['endpoint']

    if (!entityOptions.includes(entity)) {
      consola.error(
        `Entity ${entity} is not supported. Possible values: ${entityOptions.join(
          ', ',
        )}`,
      )
      process.exit(1)
    }

    const playgroundPath = resolve('./playground/app')
    const playgroundFramework = getPlaygroundFramework(playgroundPath)

    const isForce = ctx.args.force

    if (entity === 'endpoint') {

      makeTemplate('apiMethod', name, isForce)
      const typesMethodPath = resolve('./packages/api-client/src/types/api/endpoints.ts');
      writeToTypescriptFile(typesMethodPath, name)

      makeTemplate('sdkMethod', name, isForce)
      writeSDKMethod(name, isForce)

      if (playgroundFramework === 'next') {
        makeTemplate('nextPageMethod', name, isForce)
      }

      if (playgroundFramework === 'nuxt') {
        makeTemplate('nuxtPageMethod', name, isForce)
      }
    }
  }
})


async function makeTemplate(template: string, name: string, force = false) {

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
  const res = templates[template]({ name })

  // Resolve full path to generated file
  const path = resolve(res.path)

  // Ensure not overriding user code
  if (!force && existsSync(path)) {
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
}
