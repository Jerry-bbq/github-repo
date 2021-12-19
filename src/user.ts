import * as vscode from 'vscode'
import { Octokit } from '@octokit/rest'
import { getUser } from './getUser'
import { getUserRepo } from './getRepo'
import { userActivate } from './tree-view/user'
import { repoActivate } from './tree-view/repo'

const AUTH_PROVIDER_ID = 'github'
const SCOPES = ['repo', 'read:org']

// 登录状态
export enum UserState {
  init = 'init',
  notLogged = 'notLogged',
  logging = 'logging',
  errorLogging = 'errorLogging',
  logged = 'logged',
}

export enum RepoState {
  none,
  fetching,
  partial,
  fullyLoaded,
}

class UserClass {
  state: UserState = UserState.init
  token: string | undefined
  login: string | undefined
  profileUri: string | undefined
  organization: Array<any> = []
  repoState: RepoState = RepoState.none
  cloneRepos: Array<any> = []

  private resetUser(opts: { resetUserState: boolean; resetOctokit: boolean }) {
    this.login = undefined
    this.profileUri = undefined
    this.organization = []
    if (opts.resetUserState) {
      this.setUserState(UserState.notLogged)
    }
    if (opts.resetOctokit) {
      octokit = undefined
      this.token = undefined
    }
  }

  private resetRepos(opts: { reposStatus: boolean }) {
    this.cloneRepos = []
    if (opts.reposStatus) {
      this.setRepoState(RepoState.none)
    }
  }

  setRepoState(state: RepoState) {
    this.repoState = state
  }

  setUserState(state: UserState) {
    this.state = state
    vscode.commands.executeCommand('setContext', `github.userState`, this.state)
  }

  async activate() {
    // 点击登录按钮，注册命令
    vscode.commands.registerCommand('github.commands.auth', async () => {
      try {
        const session: vscode.AuthenticationSession = await vscode.authentication.getSession(AUTH_PROVIDER_ID, SCOPES, { createIfNone: true })
        const token: string = session.accessToken
        vscode.window.showInformationMessage(token)
        await this.initOctokit(token)
      } catch (error: any) {
        void vscode.window.showErrorMessage(error.message)
      }
    })

    try {
      const token = (await vscode.authentication.getSession(AUTH_PROVIDER_ID, SCOPES, { createIfNone: false }))?.accessToken
      if (token) {
        await this.initOctokit(token)
      } else {
        this.setUserState(UserState.notLogged)
      }
    } catch (error: any) {
      void vscode.window.showErrorMessage(error.message)
    }
  }
  async initOctokit(token: string): Promise<void> {
    octokit = new Octokit({ auth: token })
    this.token = token

    this.reloadRepos().catch((err: any) => {
      void vscode.window.showErrorMessage(err.message)
      octokit = undefined
      this.token = undefined
    })
  }

  public async reloadRepos(): Promise<void> {
    if ([RepoState.none, RepoState.fullyLoaded].includes(this.repoState)) {
      this.resetUser({ resetUserState: false, resetOctokit: false })
      this.resetRepos({ reposStatus: false })
      if (!octokit) {
        return
      }
      this.setRepoState(RepoState.fetching)
      await Promise.all([this.loadUser(), this.loadRepo()])
    }
  }
  private async loadUser(): Promise<void> {
    this.setUserState(UserState.logging)
    vscode.window.showInformationMessage('logging')
    const userData = await getUser()
    const { login, organizations, profileUri } = userData
    this.login = login
    this.profileUri = profileUri
    this.organization = organizations

    this.setUserState(UserState.logged)
    vscode.window.showInformationMessage('logged')
    userActivate()
  }
  private async loadRepo(): Promise<void> {
    this.setRepoState(RepoState.fetching)

    const reposData = await getUserRepo()
    this.cloneRepos = reposData
    this.setRepoState(RepoState.fullyLoaded)
    repoActivate()
  }
}

export const User = new UserClass()
export let octokit: Octokit | undefined
