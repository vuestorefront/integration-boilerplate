export interface TemplateOptions {
  name: string
  args: Record<string, any>
}

export interface Template {
  (options: TemplateOptions): { path: string; contents: string }
}
