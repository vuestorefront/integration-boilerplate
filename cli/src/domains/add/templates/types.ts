export interface TemplateOptions {
  name: string
}

export interface Template {
  (options: TemplateOptions): { path: string; contents: string }
}
