import { gql } from 'graphql-request'
import { client } from '../core/api'
import { PluginInput } from '../types'

const QUERY = gql`
  query Github($owner: String!, $name: String!, $prTemplatePath: String!) {
    repository(owner: $owner, name: $name) {
      languages(first: 10, orderBy: { direction: DESC, field: SIZE }) {
        totalSize
        edges {
          size
          node {
            name
          }
        }
      }
      prTemplate: object(expression: $prTemplatePath) {
        ... on Blob {
          text
        }
      }
    }
  }
`

export async function github (project: PluginInput) {
  const { owner, name, defaultBranchName } = project
  const { repository } = await client.request(QUERY, {
    owner,
    name,
    prTemplatePath: `${defaultBranchName}:.github/PULL_REQUEST_TEMPLATE.md`
  })
  const {
    languages: repositoryLanguages,
    prTemplate
  } = repository
  const { totalSize } = repositoryLanguages
  const languages = repositoryLanguages.edges
    .map(({ size, node }: { size: number, node: { name: string } }) => ({
      name: node.name,
      percentage: (size / totalSize) * 100,
    }))

  return {
    languages,
    prTemplateLines: prTemplate?.text.split('\n')
  }
}
