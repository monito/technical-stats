interface Check {
  status: 'pass' | 'warn' | 'fail' | 'error' | 'skip'
  value?: string | number | undefined
  message?: string
}

interface Goal {
  name: string
  description: string
  check(repo: unknown): Promise<Check>
}

type Plugin = <T extends Object>(project: Project) => T

export interface Config {
  repositories: string[]
  plugins: Plugin[]
  rules: Goal[]
}

export interface Project {
  repo: string
  owner: string
  name: string
}
