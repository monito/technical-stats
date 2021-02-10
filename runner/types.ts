export interface Check {
  status: 'pass' | 'warn' | 'fail' | 'error' | 'skip'
  value?: string | number | undefined
}

interface Goal {
  name: string
  description: string
  check(repo: Project): Promise<Check>
}

type Plugin = <T extends Object>(project: PluginInput) => T

export interface Config {
  organization?: string
  repositories?: string[]
  excludeRepos?: string[]
  plugins: Plugin[]
  rules: Goal[]
}

export interface Project {
  repo: string
  owner: string
  name: string
}

export type PluginInput = Project & {
  defaultBranchName: string
}

export type PluginOtput = {
  [key: string]: unknown
}

export type ProjectOutput = PluginInput & PluginOtput & {
  active: boolean
  url: string
  description: string
}
