import { Check, Status } from '../types'
import { round } from '../utils'

export function calculateStats(checks: Check[]) {
  const stats: Record<Status, number> = { pass: 0, warn: 0, fail: 0, error: 0, skip: 0 }
  checks.forEach(check => stats[check.status] += 1)
  const percentage = round(((stats.pass + stats.warn * 0.5) / (stats.pass + stats.warn + stats.fail)) * 100)
  return {
    stats,
    percentage
  }
}
