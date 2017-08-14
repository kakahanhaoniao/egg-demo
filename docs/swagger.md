# egg应用中引入swagger辅助开发调试
## 前言
前后端分离已经是业界所共识的一种开发/部署模式了。所谓的前后端分离，并不是传统行业中的按部门划分，一部分人纯做前端（HTML/CSS/JavaScript/Flex），另一部分人纯做后端，因为这种方式是不工作的：比如很多团队采取了后端的模板技术（JSP, FreeMarker, ERB等等），前端的开发和调试需要一个后台Web容器的支持，从而无法做到真正的分离（更不用提在部署的时候，由于动态内容和静态内容混在一起，当设计动态静态分流的时候，处理起来非常麻烦）。关于前后端开发的另一个讨论可以[参考这里](http://icodeit.org/2015/06/do-we-really-short-for-front-end-developer/)。

即使通过API来解耦前端和后端开发过程，前后端通过RESTFul的接口来通信，前端的静态内容和后端的动态计算分别开发，分别部署，集成仍然是一个绕不开的问题 — 前端/后端的应用都可以独立的运行，但是集成起来却不工作。我们需要花费大量的精力来调试，直到上线前仍然没有人有信心所有的接口都是工作的。
 
归根结底，还是前端或者后端感知到变化的时间周期太长，不能“及时协商，尽早解决”，最终导致集中爆发。怎么解决这个问题呢？我们需要提前协商好一些契约，并将这些契约作为可以被测试的中间产品，然后前后端都通过自动化测试来检验这些契约，一旦契约发生变化，测试就会失败。这样，每个失败的测试都会驱动双方再次协商，有效的缩短了反馈周期，并且降低集成风险。“前后端分离了，然后呢？”

不过，仅仅靠纪律是不够的，还需要通过工具的辅助来提高效率。下面，我们就来看一下，一个API设计工具——Swagger，将如何帮助我们更好的实现“前后端分离”。

## Swagger
Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务。总体目标是使客户端和文件系统作为服务器以同样的速度来更新。文件的方法，参数和模型紧密集成到服务器端的代码，允许API来始终保持同步。Swagger 让部署管理和使用功能强大的API从未如此简单。
如何引入swagger到我们的项目中
### 一、 swaggerUi安装
1.下载swagger ui: 
git clone https://github.com/swagger-api/swagger-ui.git

2. 项目目录下创建一个静态文件夹
mkdir public/swagger
然后将把下载好的Swagger UI 文件中dist 目录下的文件全部复制到 public 文件夹下。

3. 将mock设置为静态文件夹

```
// config.local.js (swagger服务只在开发环境下提供)
config.static = {
    prefix: '/public/',
    dir: [path.join(appInfo.root, './public/swagger')],
};
```

4. 同时添加swagger配置项

```
// swagger配置项 config.local.js (swagger服务只在开发环境下提供)
config.swagger = {
    enable: true,
    swaggerDefinition: {
        info: {
             // API informations (required)
             title: 'node中间层实践', // Title (required)
             version: '1.0.0', // Version (required)
             description: 'node sample API', // Description (optional)
        },
    },
    apis: [ path.resolve(appInfo.root, 'app/controller/*.js'), path.resolve(appInfo.root, 'app/controller/*/*.js'), path.resolve(appInfo.root, 'app/service/*.js'), path.resolve(appInfo.root, 'app/service/*/*.js') ],
};
```
5. 访问swaggerUi 127.0.0.1:7001/public/api.html

6. 到此为止，swaggerui配置结束
note: 同时可参照网络文档http://www.jianshu.com/p/d6626e6bd72c

### 二、swagger-jsdoc （编写文档并发布）
swagger-jsdoc能够抓取文件中以@swagger开头注释，生成swagger api的json文件
swagger采用[json-schema](http://json-schema.org/)进行定义

1. 配置方法

``` sh
npm install swagger-jsdoc --save-dev
```

``` js
// app/extend/context.js
const swaggerJSDoc = require('swagger-jsdoc');
//在ctx上扩展swaggerSpec方法
swaggerSpec() {
    const options = this.app.config.swagger;
    if (options && options.enable) {
        //调用jsDoc生成jsonapi数据
        return swaggerJSDoc(options);
    }
},

// app/controller/mock.js
class MockController extends app.Controller {
    show() {
        this.ctx.body = this.ctx.swaggerSpec;
    }
}

// app/router.js
app.get('/doc', 'mock.show');

```
 
2. 调用方式
http请求 /doc方法，返回数据如截图

3. api编写规范
example如下：参照(http://json-schema.org/)进行定义
1) definitions定义模块(models)

``` js
/**
* @swagger
* definitions:
*   Wish:
*     description: wish站点信息
*     required:
*       - mainProductId
*       - siteType
*       - siteId
*     properties:
*       mainProductId:
*         type: string
*         pattern: \d{32}
*         description: 主商品id
*       siteType:
*         type: string
*         enum: ['4']
*         description: 站点类型： 1=> ebay 2=>amazon 3=>newegg 4=>wish
*       siteId:
*         type: string
*         pattern: XBNZD\d{3}
*         description: 站点id
*/
```
definitions及定义数据模型，模型可以被引用，作为response值，也可以引用为parameters值


2) 定义接口

``` js
/**
 * @swagger
 * /wish/info:
 *   get:
 *     description: 返回wishi刊登平台数据
 *     tags:
 *       - Wish
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mainProductId
 *         in: query
 *         type: string
 *         description: 主商品id
 *       - name: siteType
 *         in: query
 *         type: string
 *         enum: ["4"]
 *         description: 站点类型： 1=> ebay 2=>amazon 3=>newegg 4=>wish
 *       - name: siteId
 *         in: query
 *         type: string
 *         description: 站点id
 *     responses:
 *       200:
 *         description: wish平台刊登信息
 *         schema:
 *          type: object
 *          $ref: '#/definitions/Wish'
 */
 ```
parameters表示参数定义 in参数主要分为 body query path formData四中形式，query path formData三种方式定义类似，都是 - name:参数 in:类型 type:格式 description:描述。 只有body定时方式不同，- name: body in:body required:是否必填 schema:body内数据描述，即body内所有描述都通过schema定义

## swagmock
根据swagger-jsdoc生成的api json文件，生成相应的mock数据

1. 使用方式：
1) 访问swagger-ui链接: /public/index.html
2) 获取swagger-jsdoc生成的api json的路由链接: /doc

2. 开启swagger 和 swaggerMock开关配置项 /config/config.XXX.js 中
1) config.swagger的 enable 设置项，true为启动,false为禁用
2) config.swaggerMock的 enable 设置项，true为启动,false为禁用

3. 使用swaggerMock方法
获取swaggerMock的mock数据的需要传递method(通过请求参数获取)和http返回的状态值来生成相应的mock数据，该参数配置在 /config/config.XXX.js 中

``` js
parameters: {
    response: 'httpStatus', // http返回的状态值，默认为200状态
    checkMock: 'debugger', // 通过该参数来判断接口请求是否需要mock数据
},
```
获取请求接口的mock数据方式: /yourPath?debugger

    swaggermock提供的mock功能相对简单，不能像mock.js生成相对漂亮的数据。但是考虑到开发过程中，如果api文档和mock数据尽量使用一套，会减轻很多开发内容，所以暂时使用swaggerMock来成成mock数据，后续将继续研究该模块，尽量保证开发量不大的前提下，生成尽可能漂亮的mock数据
