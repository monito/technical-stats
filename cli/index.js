import { run } from '../runner'
import fs from 'fs'
import path from 'path'

;(async () => {
  const configPath = path.resolve('stats.config.js')
  const config = require(configPath)
  const report = await run(config)

  const templatePath = path.resolve(__dirname, '../report-viewer/index.html')
  const outputPath = path.resolve('report.html')
  const htmlReport = fs
    .readFileSync(templatePath, 'utf-8')
    .replace('%REPORT_JSON%', JSON.stringify(report))


  fs.writeFileSync(outputPath, htmlReport)
  console.log('generated report file at', outputPath)
})()
