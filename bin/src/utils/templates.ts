import { upperFirst } from 'scule'
import { Template } from './templates/types'
import { nuxtPageMethod } from './templates/nuxtPageMethod'

const method = nuxtPageMethod

export const templates = {
  method,
} as Record<string, Template>
