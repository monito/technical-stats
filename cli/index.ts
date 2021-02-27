import * as fs from 'fs'
import * as path from 'path'
import { run } from '../runner'

export * from '../runner/plugins'
export * as utils from '../runner/utils'

export const cli = async (workingDirectory: string) => {
  const configPath = path.resolve(workingDirectory, 'stats.config.js')
  const config = require(configPath)
  const report = await run(config)

  const templateHtml = path.resolve(__dirname, '../report-viewer/index.html')
  const outputHtml = path.resolve(workingDirectory, 'report.html')
  const otputJson = path.resolve(workingDirectory, 'report.json')
  const htmlReport = fs
    .readFileSync(templateHtml, 'utf-8')
    .replace('%REPORT_JSON%', JSON.stringify(report))

  fs.writeFileSync(otputJson, JSON.stringify(report, null, 2))
  fs.writeFileSync(outputHtml, htmlReport)
  console.log('Generated report file at: ', outputHtml)
}
