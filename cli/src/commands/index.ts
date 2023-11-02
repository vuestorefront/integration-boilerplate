import type { CommandDef } from 'citty'

const _rDefault = (r: any) => (r.default || r) as Promise<CommandDef>

export const commands = {
  add: () => import('./add').then(_rDefault),
  call: () => import('./call').then(_rDefault),
} as const
