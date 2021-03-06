import * as fs from 'fs'
import * as path from 'path'
import { run } from '../runner'

export * from '../runner/plugins'
export * as utils from '../runner/utils'

function saveReport(directory: string, fileName: string, fileContent: string) {
  const outputFile = path.resolve(directory, fileName)
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

  const out = outputDirectory || workingDirectory
  saveReport(out, 'report.html', htmlReport)
  saveReport(out, 'report.json', jsonReport)
  saveReport(out, `report-${date}.html`, htmlReport)
  saveReport(out, `report-${date}.json`, jsonReport)
}
