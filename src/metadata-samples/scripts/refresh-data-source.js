import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = join(__dirname, '../datasources.config.json')

let config
try {
  config = JSON.parse(readFileSync(configPath, 'utf-8'))
} catch (err) {
  console.error(`Failed to read datasources.config.json: ${err.message}`)
  process.exit(1)
}

if (!Array.isArray(config.tables) || config.tables.length === 0) {
  console.error('datasources.config.json must contain a non-empty "tables" array.')
  process.exit(1)
}

const failed = []

for (const table of config.tables) {
  console.log(`Adding data source: ${table}`)
  try {
    execSync(`pac code add-data-source -a dataverse -t ${table}`, { stdio: 'inherit' })
  } catch (err) {
    console.error(`  ✗ Failed to add data source "${table}": ${err.message}`)
    failed.push(table)
  }
}

if (failed.length > 0) {
  console.error(`\n${failed.length} table(s) failed:`)
  for (const table of failed) console.error(`  - ${table}`)
  process.exit(1)
}

console.log(`\nSuccessfully registered ${config.tables.length} data source(s).`)
