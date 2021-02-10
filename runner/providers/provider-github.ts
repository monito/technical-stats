import { gql } from 'graphql-request'
import { client } from '../core/api'
import { Project, Config } from '../types'

const QUERY_GITHUB_REPOSITORIES = gql`
  query GithubRepositories($organization: String!) {
    organization(login: $organization) {
      repositories(last: 100) {
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
      isArchived
      defaultBranchRef {
        name
      }
    }
  }
`

export async function getRepository(project: Project) {
  const { owner, name } = project
  const { repository } = await client.request(QUERY_GITHUB_REPOSITORY, { owner, name })
  const { url, description, isArchived, defaultBranchRef } = repository

  return {
    url,
    description,
    isArchived,
    defaultBranchName: defaultBranchRef.name,
  }
}

export async function getRepositories(config: Config) {
  const { organization } = await client.request(QUERY_GITHUB_REPOSITORIES, { organization: config.organization })
  const orgRepositories: string[] = organization.repositories.nodes.map(({ name }: { name: string }) => `${config.organization}/${name}`)
  const repos = config.repositories || orgRepositories || []
  const exclude = config.excludeRepos || []

  return repos.filter(repo => exclude.every(exclusion => !repo.includes(exclusion)))
}
