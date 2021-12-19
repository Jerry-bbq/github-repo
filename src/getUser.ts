import { octokit } from './user'

const query = `
query getUser($after: String) {
    viewer {
      login
      url
      organizations(first: 100, after: $after) {
        edges {
          node {
            login
            name
            viewerCanCreateRepositories
          }
        }
      }
    }
  }
`
// 获取用户信息
export async function getUser(): Promise<any> {
  if (!octokit) {
    throw new Error('Octokit not set up!')
  }
  try {
    const response: any = await octokit.graphql(query)
    const userData = response.viewer
    
    return {
      login: userData.login,
      profileUri: userData.url,
      organizations: userData.organizations.edges.map((org: any) => org.node),
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
