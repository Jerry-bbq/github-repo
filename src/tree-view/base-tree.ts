import * as vscode from 'vscode'

type CommandWithoutTitle = Omit<vscode.Command, 'title'> & {
  title?: string
}

export type TreeItemConstructor = Omit<vscode.TreeItem, 'command'> & {
  label: string
  children?: TreeItem[] | TreeItem
  command?: CommandWithoutTitle | string
}

export class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined

  constructor({ label, children, command, ...rest }: TreeItemConstructor) {
    const collapsibleState = children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
    super(label, collapsibleState)

    if (children) {
      this.children = Array.isArray(children) ? children : [children]
    }

    if (typeof command === 'string') {
      this.command = { command: command, title: '' }
    } else if (command) {
      this.command = { ...command, title: command.title || '' }
    }

    Object.assign(this, rest)
  }
}

export abstract class BaseTreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem> = new vscode.EventEmitter<TreeItem>()
  readonly onDidChangeTreeData: vscode.Event<TreeItem> = this._onDidChangeTreeData.event

  protected data: TreeItem | TreeItem[] = []
  
  constructor() {
    this.makeData()
  }

  refresh(): void {
    this.makeData()
    this._onDidChangeTreeData.fire(null as any) // arg don't seem to care.
  }

  protected abstract makeData(): void

  // Both below are required by vscode.TreeDataProvider, that it implements.
  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }
  getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) return Array.isArray(this.data) ? this.data : [this.data]
    return element.children
  }
}
