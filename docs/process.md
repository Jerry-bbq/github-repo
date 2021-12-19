
## 启动项目

```bash
# 开启监听
npm run watch

# 然后打开调试框fn+F5
```

## 配置活动栏

```json
{
    "contributes": {
		"viewsContainers": {
			"activitybar": [
				{
					"id": "github",
					"title": "GitHub Repository Manager",
					"icon": "images/logo.png"
				}
			]
		},
		"views": {
			"github": [
				{
					"id": "github.account",
					"name": "Account"
				},
				{
					"id": "github.repo",
					"name": "Repositories"
				}
			]
		}
    }
}
```

在配置了`viewsContainers.activitybar`之后，直接去调试是不会显示活动栏的，必须再配置`views`之后才会显示，结果如下：

![activitybar](./images/activitybar.png)

## 配置viewsWelcome

```json
{
    "contributes": {
        "viewsWelcome": [
            {
                "view": "github.account",
                "contents": "You are not yet logged in\n[Login with your GitHub account](command:github.commands.auth)"
            }
        ]
    }
}
```

结果如下：

![viewsWelcome](./images/viewsWelcome.png)

> 如需触发条件可在添加`when`字段

## 登录

- [vscode.authentication.getSession(providerId,scopes,{})](https://code.visualstudio.com/api/references/vscode-api)

拿到的结果如下：

```json
{
    "id":"0bb0bb5f-4be4-49d5-bacb-5f6933018913",
    "account":{
        "label":"luguanrui",
        "id":21119295
    },
    "scopes":["repo","read:org"],
    "accessToken":"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"
}
```

- [@octokit/rest](https://github.com/octokit/rest.js)

GitHub REST API client for JavaScript

```bash
npm install @octokit/rest
```

点击按钮`Login with your GitHub account`,会弹出如下的内容：

![](./images/github-login.png)

![](./images/github-login2.png)

![](./images/github-login3.png)