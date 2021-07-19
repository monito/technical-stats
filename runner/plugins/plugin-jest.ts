import { gql } from 'graphql-request'
import { parse } from 'json5'
import { client } from '../core/api'
import { PluginInput } from '../types'

const QUERY = gql`
  query JestConfig($owner: String!, $name: String!, $configPath: String!) {
    repository(owner: $owner, name: $name) {
      jestConfig: object(expression: $configPath) {
        ... on Blob {
          text
        }
      }
    }
  }
`

async function getJestConfig(project: PluginInput, fileName: string) {
  const { owner, name, defaultBranchName } = project
  const configPath = `${defaultBranchName}:${fileName}`
  const {
    repository: { jestConfig },
  } = await client.request(QUERY, { owner, name, configPath })

  return jestConfig
    ? parse(jestConfig.text.substring('module.exports = '.length))
    : undefined
}

export async function jestConfig(project: PluginInput) {
  return (
    (await getJestConfig(project, 'jest.config.js')) ||
    (await getJestConfig(project, 'jest.config.base.js')) ||
    {}
  )
}
