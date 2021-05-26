import 'dotenv/config'
import { Config, ProjectScanned, CheckOutput, GoalOutput, Report } from './types'
import { getRepositories, getRepository } from './providers/provider-github'
import { calculateStats, runChecks } from './features'
import { runPlugins } from './plugins'
import { sleep } from './utils'

const SERVICE_SCAN_TIMEOUT = 100

async function scanProjects(repositories: string[], config: Config): Promise<ProjectScanned[]> {
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
  return scannedProjects.filter(project => project.active)
}

async function prepareReport(scannedProjects: ProjectScanned[], config: Config): Promise<Report> {
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

  const allChecks: CheckOutput[] = []
  const projects = await Promise.all(
    scannedProjects
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

export async function run(config: Config): Promise<Report> {
  const repositories = await getRepositories(config)

  console.log(`Running plugins for ${repositories.length} repositories...`)
  const scannedProjects = await scanProjects(repositories, config)

  console.log(`Running checks for ${scannedProjects.length} projects...`)
  const report = await prepareReport(scannedProjects, config)

  return report
}
