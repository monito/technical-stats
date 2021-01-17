interface Check {
  status: 'pass' | 'warn' | 'fail' | 'error' | 'skip'
  value?: string | number | undefined
}

interface Goal {
  name: string
  description: string
  check(repo: Project): Promise<Check>
}

export interface CheckResult extends Check {
  name: string
  description: string
}

type Plugin = <T extends Object>(project: Project) => T

export interface Config {
  organization?: string
  repositories?: string[]
  plugins: Plugin[]
  rules: Goal[]
}

export interface Project {
  repo: string
  owner: string
  name: string
}

export interface ProjectInfo {
  repo: string
  owner: string
  name: string
  [key: string]: string
}
