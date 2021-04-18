export type Status = 'pass' | 'warn' | 'fail' | 'error' | 'skip'

export type Stats = Record<Status, number>

export interface Check {
  status: Status
  value?: string | number | undefined
}

export interface CheckOutput extends Check {
  name: string
  repo: string
}

export interface Goal {
  name: string
  description: string
  link?: string
  only?: boolean
  check(repo: Project): Promise<Check>
}

type Plugin = <T extends Object>(project: PluginInput) => T

export interface Config {
  organization: string
  amountOfRepos?: number
  repositories?: string[]
  excludeRepos?: string[]
  checkAchieved(percentage: number): Check
  plugins: Plugin[]
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

export type ProjectScanned = PluginInput & PluginOutput & {
  active: boolean
  url: string
  description: string
}

export interface StatsOutput {
  stats: Stats
  percentage: number
  achieved: Check
}

export interface ProjectOutput extends StatsOutput {
  repo: string
  description: string
  url: string
  checks: CheckOutput[]
}

export interface GoalOutput extends StatsOutput {
  name: string
  description: string
  link?: string
  checks: CheckOutput[]
  stats: Stats
  achieved: Check
}

export interface Output {
  organization: string
  projects: ProjectOutput[]
  goals: GoalOutput[]
  stats: Stats
  totalAchieved: Check
  generatedAt: string
}
