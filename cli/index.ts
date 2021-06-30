import * as fs from 'fs'
import * as path from 'path'
import { run } from '../runner'

export * from '../runner/plugins'
export * as utils from '../runner/utils'

function saveReport(workingDirectory: string, fileName: string, fileContent: string) {
  const outputFile = path.resolve(workingDirectory, fileName)
  fs.writeFileSync(outputFile, fileContent)
  console.log('Generated report file at: ', fileName)
}

export const cli = async (workingDirectory: string, outputDirectory?: string) => {
  const configPath = path.resolve(workingDirectory, 'stats.config.js')
  const config = require(configPath)
  const report = await run(config)

  const templateHtml = path.resolve(__dirname, '../report-viewer/index.html')
  const htmlReport = fs
    .readFileSync(templateHtml, 'utf-8')
    .replace('%REPORT_JSON%', JSON.stringify(report))
  const jsonReport = JSON.stringify(report, null, 2)

  const now = new Date()
  const date = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`

  saveReport(outputDirectory || workingDirectory, 'report.html', htmlReport)
  saveReport(outputDirectory || workingDirectory, 'report.json', jsonReport)
  saveReport(outputDirectory || workingDirectory, `report-${date}.html`, htmlReport)
  saveReport(outputDirectory || workingDirectory, `report-${date}.json`, jsonReport)
}
