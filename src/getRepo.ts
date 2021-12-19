import { octokit } from './user'

const repoInfosQuery = `
name
description
owner {
  login
}
primaryLanguage {
  name
}
url
isPrivate
isFork
isTemplate
parent {
  name
  owner {
    login
  }
}
createdAt
updatedAt
`

const query = `
query getRepos ($after: String) {
    viewer {
      repositories(
        first: 100, after: $after
        affiliations: [OWNER], ownerAffiliations:[OWNER],
        orderBy: { field: NAME, direction: ASC }
      ) {
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          ${repoInfosQuery}
        }
      }
    }
}`

// 获取用户仓库
export async function getUserRepo(): Promise<any> {
  if (!octokit) {
    throw new Error('Octokit not set up!')
  }
  const repos: any = []
  let endCursor: string | null = null
  let hasNextPage = true

  while (hasNextPage) {
    const response: any = await octokit.graphql(query, {
      after: endCursor,
    })
    const { nodes, pageInfo } = response.viewer.repositories

    ;({ endCursor, hasNextPage } = pageInfo)

    repos.push(...nodes.map((node: any) => extractRepositoryFromData(node)))
  }

  return repos
}

function extractRepositoryFromData(data: any) {
  return {
    name: data.name,
    description: data.description,
    ownerLogin: data.owner.login,
    languageName: data.primaryLanguage?.name,
    url: data.url,

    // gitUrl: data.,

    isPrivate: data.isPrivate,
    isFork: data.isFork,
    isTemplate: data.isTemplate,

    // parent may be null if isn't a fork.
    parentRepoName: data.parent?.name,
    parentRepoOwnerLogin: data.parent?.owner.login,

    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  }
}
