export type Status = 'pass' | 'warn' | 'fail' | 'error' | 'skip'

export interface Check {
  status: Status
  value?: string | number | undefined
}

export interface CheckOutput extends Check {
  name: string
}

interface Goal {
  name: string
  description: string
  link?: string
  only?: boolean
  check(repo: Project): Promise<Check>
}

type Plugin = <T extends Object>(project: PluginInput) => T

export interface Config {
  organization?: string
  amountOfRepos?: number
  repositories?: string[]
  excludeRepos?: string[]
  plugins: Plugin[]
  checkAchieved(percentage: number): Check
  goals: Goal[]
}

export interface Project {
  repo: string
  owner: string
  name: string
}

export type PluginInput = Project & {
  defaultBranchName: string
}

export type PluginOutput = {
  [key: string]: unknown
}

export type ProjectOutput = PluginInput & PluginOutput & {
  active: boolean
  url: string
  description: string
}
