import 'dotenv/config'
import { Config, Project, ProjectScanned, CheckOutput, GoalOutput, Output } from './types'
import { getRepositories, getRepository } from './providers/provider-github'
import { calculateStats, runChecks } from './features'
import { runPlugins } from './plugins'
import { sleep } from './utils'

const SERVICE_SCAN_TIMEOUT = 100

export async function run(config: Config): Promise<Output> {
  const repositories = await getRepositories(config)
  const goalsMap = config.goals.reduce<Record<string, GoalOutput>>((accumulator, goal) => {
    accumulator[goal.name] = {
      name: goal.name,
      description: goal.description,
      link: goal.link,
      checks: [],
      stats: { pass: 0, warn: 0, fail: 0, error: 0, skip: 0 },
      percentage: 0,
      achieved: { status: 'error', value: 'Not yet calculated' }
    }
    return accumulator
  }, {})

  console.log(`Running plugins for ${repositories.length} repositories...`)
  const scannedProjects = await Promise.all(
    repositories.map(async (repo, index): Promise<ProjectScanned> => {
      const [owner, name] = repo.split('/')
      const project = { repo, owner, name }
      const { url, description, isArchived, defaultBranchName } = await getRepository(project)
      if (isArchived) {
        return {
          active: false
        } as ProjectScanned
      }

      await sleep(index * SERVICE_SCAN_TIMEOUT)
      console.log(`Scanning ${repo}...`)
      const pluginsData = await runPlugins({ ...project, defaultBranchName }, config)
      return {
        active: true,
        url,
        description,
        defaultBranchName,
        ...project,
        ...pluginsData,
      }
    })
  )
  const filteredProjects = scannedProjects.filter(project => project.active)

  console.log(`Running checks for ${filteredProjects.length} projects...`)
  const allChecks: CheckOutput[] = []
  const projects = await Promise.all(
    filteredProjects
      .map(async (project) => {
        const checks = await runChecks(project, config)
        allChecks.push(...checks)
        checks.forEach(check => {
          goalsMap[check.name].checks.push(check)
        })

        return {
          repo: project.repo,
          description: project.description,
          url: project.url,
          checks,
          ...calculateStats(checks, config),
        }
      })
  )

  const goals: GoalOutput[] = Object.values(goalsMap).map((goal) => {
    return {
      ...goal,
      ...calculateStats(goal.checks, config),
    }
  })

  const { stats, achieved } = calculateStats(allChecks, config)

  return {
    organization: config.organization,
    generatedAt: new Date().toISOString(),
    totalAchieved: achieved,
    stats,
    goals,
    projects,
  }
}
