import * as vscode from 'vscode'
import { TreeItem, BaseTreeDataProvider } from './base-tree'
import { User, RepoState } from '../user'

export function repoActivate(): void {
  const repoTreeDataProvider = new TreeDataProvider()
  vscode.window.registerTreeDataProvider('github.views.repo', repoTreeDataProvider)
  repoTreeDataProvider.refresh()
}

class TreeDataProvider extends BaseTreeDataProvider {
  constructor() {
    super()
  }
  getData() {
    switch (User.repoState) {
      case RepoState.none:
        return [] // So on not logged user it won't be 'Loading...' for ever.
      case RepoState.fetching:
        return new TreeItem({
          label: 'Loading...',
        })
      case RepoState.partial:
        //   case RepoState.fullyLoaded:
          return [getClonedTreeItem(), getNotClonedTreeItem()]
    }
  }
  protected makeData() {
    this.data = this.getData()
  }
}

function getClonedTreeItem() {}

function getNotClonedTreeItem() {}
