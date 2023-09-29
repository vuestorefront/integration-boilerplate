import { Template } from './templates/types'
import { nuxtPageMethod } from './templates/nuxtPageMethod'
import { sdkMethod } from './templates/sdkMethod'
import { apiMethod } from './templates/apiMethod'
import { nextPageMethod } from './templates/nextPageMethod'

export const templates = {
  apiMethod,
  sdkMethod,
  nuxtPageMethod,
  nextPageMethod
} as Record<string, Template>
