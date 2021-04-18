import { Check, Stats, Config, StatsOutput } from '../types'
import { round } from '../utils'

function calculatePercentage(stats: Stats) {
  const progress = (stats.pass + stats.warn * 0.5)
  const total = (stats.pass + stats.warn + stats.fail)
  if (total === 0) {
    return 0
  }
  return round((progress / total) * 100)
}

export function calculateStats(checks: Check[], config: Config): StatsOutput {
  const stats: Stats = { pass: 0, warn: 0, fail: 0, error: 0, skip: 0 }
  checks.forEach(check => stats[check.status] += 1)
  const percentage = calculatePercentage(stats)
  return {
    stats,
    percentage,
    achieved: config.checkAchieved(percentage)
  }
}
