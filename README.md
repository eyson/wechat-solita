# 项目介绍

一个基于微信的接龙小程序，开箱即用。



# 功能说明


- 发起接龙 - 简单易用，分类活动及拼团两种类型，可设置报名上限

- 接龙报名 - 报名参加活动，拼团类活动能够自动计算金额

- 报名确认 - 活动创建者可针对报名的用户标记完成情况




# 部署说明

在部署前，你应该先了解小程序的申请、开发、发布流程，以及小程序的云开发功能。本文档不做介绍。



#### 1.修改项目名称及 appid 配置

在下载代码后，开发者优先修改小程序的配置信息。你可以打开根目录下的 `project.config.json` 文件，修改 `appid` 和 `项目名称`。



```json
{
	"miniprogramRoot": "miniprogram/",
	"cloudfunctionRoot": "cloudfunctions/",
	"setting": {
		"urlCheck": true,
		"es6": true,
		"postcss": true,
		"minified": true,
		"newFeature": true
	},
	"appid": "your appid", // 开发者需要修改成自己的appid
	"projectname": "wechat-solita", // 开发者需要修改成自己的项目名称
	"libVersion": "2.7.0",
	"simulatorType": "wechat",
	"simulatorPluginLibVersion": {},
	"cloudfunctionTemplateRoot": "cloudfunctionTemplate",
	"condition": {
		"search": {
			"current": -1,
			"list": []
		},
		"conversation": {
			"current": -1,
			"list": []
		},
		"plugin": {
			"current": -1,
			"list": []
		},
		"game": {
			"list": []
		},
		"miniprogram": {
			"current": 0,
			"list": []
		}
	}
}
```





#### 2.使用小程序开发工具创建数据库

目前小程序用到两个数据库集合，开发者需要自行创建 `post` 和 `apply` 两个数据库集合。当然，你可以通过修改代码后，自行命名数据库名称。



#### 3.创建 release 和 test 环境

为避免开发过程中对生产环境功能及数据造成影响，我们需要创建生产环境 `release` 和测试环境 `test` 。开发者可以通过小程序开发工具云开发功能进行创建。



> release 和 test 是环境ID，不是环境名称



所有的云函数及 `app.js` 都有使用环境变量入口，默认是 `release` 环境，开发者需要根据实际情况进行修改。



示例：

```js
cloud.init({
    // 1.release - 正式
    // 2.test    - 测试
    // env: 'test'
    env: 'release'
});

```



![圈子报名-小程序-二维码](http://www.eyson.cn/usr/uploads/2019/06/2486414760.jpg)
![尤点意思-公众号-二维码](http://www.eyson.cn/usr/uploads/2019/06/1999457739.jpg)