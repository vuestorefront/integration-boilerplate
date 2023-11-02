import { existsSync, promises as fsp } from 'fs'
import { dirname, resolve } from 'pathe'
import { createConsola } from 'consola'
import { templates } from '../domains/add/templates'
import { defineCommand } from 'citty'
import { getPlaygroundFramework } from '../domains/add/getPlaygroundFramework'
import { writeSDKMethod } from '../domains/add/writeSdkMethod'
import { writeApiMethod } from '../domains/add/writeApiMethod'

const consola = createConsola({ fancy: true })

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
      makeTemplate('sdkMethod', name, isForce)
      writeApiMethod(name)
      writeSDKMethod(name)

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
  const prettyPath = res.path

  // Resolve full path to generated file
  const path = resolve(res.path)

  // Ensure not overriding user code
  if (!force && existsSync(path)) {
    consola.error(`File already exists: ${prettyPath}`)
    consola.box("🚙 beep beep! We did't want to risk overwriting your awesome code. \n To overwrite this path ☝️ Use --force")
    process.exit(1)
  }

  // Ensure parent directory exists
  const parentDir = dirname(path)
  if (!existsSync(parentDir)) {
    if (template === 'page') {
      consola.info('This enables vue-router functionality!')
    }
    await fsp.mkdir(parentDir, { recursive: true })
  }

  // Write file
  await fsp.writeFile(path, res.contents.trim() + '\n')
  consola.log(`🪄 Generated a new ${template}`)
}
