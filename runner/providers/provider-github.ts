import { gql } from 'graphql-request'
import { client } from '../core/api'
import { Project, Config } from '../types'

const QUERY_GITHUB_REPOSITORIES = gql`
  query GithubRepositories($organization: String!) {
    organization(login: $organization) {
      repositories(last: 10) {
        nodes {
          name
        }
      }
    }
  }
`

const QUERY_GITHUB_REPOSITORY = gql`
  query Github($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      url
      description
    }
  }
`

export async function getRepository(project: Project) {
  const { owner, name } = project
  const { repository } = await client.request(QUERY_GITHUB_REPOSITORY, { owner, name })
  const { url, description} = repository

  return {
    url,
    description,
  }
}

export async function getRepositories(config: Config) {
  const { organization } = await client.request(QUERY_GITHUB_REPOSITORIES, { organization: config.organization })
  const orgRepositories: string[] = organization.repositories.nodes.map(({ name }: { name: string }) => `${config.organization}/${name}`)
  return config.repositories || orgRepositories || []
}
