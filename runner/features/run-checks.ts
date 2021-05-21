import { Config, ProjectScanned, CheckOutput } from '../types'

export async function runChecks(
  project: ProjectScanned,
  config: Pick<Config, 'goals'>
): Promise<CheckOutput[]> {
  return Promise.all(
    config.goals.map(async ({ check, name }): Promise<CheckOutput> => {
      try {
        const checkResult = await check(project)
        return {
          ...checkResult,
          name,
          repo: project.repo,
        }
      } catch (err) {
        return {
          status: 'error',
          value: err.message,
          name,
          repo: project.repo,
        }
      }
    })
  )
}
