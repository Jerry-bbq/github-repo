
## 启动项目

```bash
# 开启监听
npm run watch

# 然后打开调试框
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
                "contents": "You are not yet logged in\n[Login with your GitHub account](command:githubRepoMgr.commands.auth.vscodeAuth)"
            }
        ]
    }
}
```

结果如下：

![viewsWelcome](./images/viewsWelcome.png)

> 如需触发条件可在添加`when`字段

## 登录


