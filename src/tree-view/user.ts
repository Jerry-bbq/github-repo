import * as vscode from 'vscode'
import { TreeItem, BaseTreeDataProvider } from './base-tree'
import { User, UserState } from '../user'

export function userActivate(): void {
  let dataProvider = new TreeDataProvider()
  vscode.window.registerTreeDataProvider('github.views.accout', dataProvider)
  vscode.window.showInformationMessage(JSON.stringify(User))
  //   update tree view
  dataProvider.refresh()
  vscode.commands.registerCommand('github.commands.openPage', async () => {
    if (User.profileUri) {
      await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(User.profileUri))
    }
  })
}

class TreeDataProvider extends BaseTreeDataProvider {
  constructor() {
    super()
  }
  getData() {
    switch (User.state) {
      case UserState.errorLogging:
        return new TreeItem({ label: 'an error happened' })
      case UserState.notLogged:
        return []
      case UserState.init:
      case UserState.logging:
        return new TreeItem({ label: 'Loading...' })
      case UserState.logged:
        return loggedTreeData()
    }
  }
  protected makeData() {
    this.data = this.getData()
  }
}

function loggedTreeData() {
  return [
    new TreeItem({
      label: `Hi, ${User.login}`,
      iconPath: new vscode.ThemeIcon('verified'),
      children: [
        new TreeItem({
          label: 'open github page',
          command: 'github.commands.openPage',
          iconPath: new vscode.ThemeIcon('github'),
        }),
      ],
    }),
  ]
}
