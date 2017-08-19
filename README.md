# sss安装运行
1. 开发环境安装

        1) git clone http://github.com/XXX.git
        2) 本地安装npm和node，node环境>=6.0.0
        3) 安装本地依赖包 npm install
        4) 运行 npm run debug(支持热更新)
        5）note: 启动调试
        执行指令：
        1) npm install anyproxy -g
        2) anyproxy --port 8888
        3) http_proxy=http://127.0.0.1:8888 npm run dev
        然后就可以正常操作了，所有经过 HttpClient 的请求，都可以在 http://localhost:8002 这个控制台中查看



2. 生产环境安装

        1）通开发环境安装1、2
        2）安装本地依赖包 npm install --production
        3) 直接运行 EGG_SERVER_ENV=prod node index.js
        4) 后台运行方式 EGG_SERVER_ENV=prod nohup node index.js > stdout.log 2> stderr.log &

# swagger
引入 swagger-ui swagger-jsdoc swagmock
### [swagger-ui](https://github.com/swagger-api/swagger-ui)
    swawgger-ui [使用参照教程](http://www.jianshu.com/p/d6626e6bd72c)

### [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
swagger-jsdoc能够抓取文件中以@swagger开头注释，生成swagger api的json文件
swagger采用[json-schema](http://json-schema.org/)进行定义
example如下：
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

parameters表示参数定义 in参数主要分为 body query path formData四中形式，query path formData三种方式定义类似，都是 - name:参数 in:类型 type:格式 description:描述。
只有body定时方式不同，- name: body in:body required:是否必填 schema:body内数据描述，即body内所有描述都通过schema定义


### [swagmock](https://github.com/subeeshcbabu/swagmock)
根据swagger-jsdoc生成的api json文件，生成相应的mock数据

### 使用方式：

1) 访问swagger-ui链接: **/mock/index.html**
2) 获取swagger-jsdoc生成的api json的路由链接: **/doc**

### 开启swagger 和 swaggerMock开关配置项 **/config/config.XXX.js** 中

1) config.swagger的 enable 设置项，true为启动,false为禁用
2) config.swaggerMock的 enable 设置项，true为启动,false为禁用

### 使用swaggerMock方法
获取swaggerMock的mock数据的需要传递method(通过请求参数获取)和http返回的状态值来生成相应的mock数据，该参数配置在 **/config/config.XXX.js** 中

``` js
parameters: {
    response: 'httpStatus', // http返回的状态值，默认为200状态
    checkMock: 'debugger', // 通过该参数来判断接口请求是否需要mock数据
},
```
获取请求接口的mock数据方式: **/yourPath?debugger**

# exception错误处理
1. 默认exception会有三个返回值 errorMsg、errorType、statusCode

    errorMsg: 错误消息描述
    errorType: 错误类型
    statusCode: 错误状态码(包括后台接口返回错误状态码以及自定义状态码)

2. 错误处理根据模块定义(**/exception** 文件夹下)获取自定义错误处理

        1) AuthenticaionFailException: 用户认证(登录权限)
        2) CommonInterfaceFailException: 通用接口错误处理
        3) ServerFailException: 服务层通用接口错误处理
        4) publish文件夹: 刊登模块错误处理

调用方式：new yourException(errName, errMessage)

3. ValidateException 控制器数据校验错误 (3000412为校验错误状态码)


# validate 数据校验

    （开发过程中考虑与前台async-validator保持一致，但由于该校验插件不支持generator，且深度校验会报错，采用egg官方的egg-validate[parameter](https://github.com/node-modules/parameter#rule)插件）
parameter也不支持深度校验，需要自定义校验，所以需要使用addRule方法添加校验
目前框架已经对validate进行封装，集合了公共方法，相关文件夹 **/app/validator**
校验是接收参数为三个参数(type,value,所在级别的object),故自定义规则(深度校验的时候)，同级别校验在同级添加rule，多个自己共同校验时在父级/祖级对象添加rule

# I18n 国际化
通过设置 Plugin 配置 i18n: true，开启多语言支持。语言文件存储路径统一存放在 config/config.default.js  下，采用zh-CN.js，使用方法

``` js
// config/locales/zh-CN.js
module.exports = {
  "Email": "邮箱",
  "Welcome back, %s!": "欢迎回来, %s!",
  "Hello %s, how are you today?": "你好 %s, 今天过得咋样？",
};
```

# 日志
日志对于 Web 开发的重要性毋庸置疑，它对于监控应用的运行状态、问题排查等都有非常重要的意义。
egg框架支持强大的企业级日志支持，主要特性：
1) 日志分级
2) 统一错误日志，所有 logger 中使用 .error() 打印的 ERROR 级别日志都会打印到统一的错误日志文件中，便于追踪
3)启动日志和运行日志分离
4)自定义日志
5)多进程日志
6)自动切割日志
7)高性能

## 1. 日志路径
所有日志文件默认都放在 ${appInfo.root}/logs/${appInfo.name} 路径下，例如 /home/admin/logs/example-app。
在本地开发环境 (env: local) 和单元测试环境 (env: unittest)，为了避免冲突以及集中管理，日志会打印在项目目录下的 logs 目录，例如 /path/to/example-app/logs/example-app。
如果想自定义日志路径：

``` js
// config/config.${env}.js
exports.logger = {
  dir: '/path/to/your/custom/log/dir',
};
```
## 2. 日志级别

日志分为 NONE，DEBUG，INFO，WARN 和 ERROR 5 个级别。日志打印到文件中的同时，为了方便开发，也会同时打印到终端中。默认只会输出 INFO 及以上（WARN 和 ERROR）的日志到文件中。
## 3. 日志切割
企业级日志一个最常见的需求之一是对日志进行自动切割，以方便管理。框架对日志切割的支持由 egg-logrotator 插件提供。按天切割是框架的默认日志切割方式，在每日 00:00 按照 .log.YYYY-MM-DD 文件名进行切割。
以 appLog 为例，当前写入的日志为 example-app-web.log，当凌晨 00:00 时，会对日志进行切割，把过去一天的日志按 example-app-web.log.YYYY-MM-DD 的形式切割为单独的文件。
同时还支持 **按照文件大小切割** 和 **按照小时切割**
## 4. 如何打印日志
## 4.1 Context Logger

如果我们在处理请求时需要打印日志，这时候使用 Context Logger，用于记录 Web 行为相关的日志。每行日志会自动记录上当前请求的一些基本信息， 如 [$userId/$ip/$traceId/${cost}ms $method $url]。

``` js
ctx.logger.debug('debug info');
ctx.logger.info('some request data: %j', ctx.request.body);
ctx.logger.warn('WARNNING!!!!');

// 错误日志记录，直接会将错误日志完整堆栈信息记录下来，并且输出到 errorLog 中
// 为了保证异常可追踪，必须保证所有抛出的异常都是 Error 类型，因为只有 Error 类型才会带上堆栈信息，定位到问题。
ctx.logger.error(new Error('whoops'));
```
## 4.2 App Logger

如果我们想做一些应用级别的日志记录，如记录启动阶段的一些数据信息，可以通过 App Logger 来完成。

``` js
// app.js
module.exports = app => {
  app.logger.debug('debug info');
  app.logger.info('启动耗时 %d ms', Date.now() - start);
  app.logger.warn('warning!');

  app.logger.error(someErrorObj);
};
```

# 代码检查 esLint

1. 命令行输入： npm run lint，输入之后对项目下所有文档进行代码检查，如果开发中使用es6进行开发，需要在 .eslintrc文件中加入

``` js
···
"parser": "babel-eslint"
···
```

2. 如果需要对某些文件或者文件夹取消代码检查，需要在 **.eslintignore** 文件夹中加入要屏蔽的文件或者文件夹

``` js
···
node_modules/
public/swagger/
···
```

3. atom编辑器下建议安装 ESLint Fixer 插件，可以对当前文件进行eslint检查并自动修复

# redis-cache
使用内部npm库，该包名仍需修改，跟外部npm包重名，如需发布到外网，需重新命名
安装依赖是需提前设置 npm set registry 内部链接


# debug 调试信息
[debug](https://github.com/visionmedia/debug)（调试模块和日志模块不要混淆，而且日志模块也有很多功能，这里所说的日志都是调试信息。）
在开发过程中，有些数据不需要打入日志，仅是用来辅助调试，debug就是来辅助调试
1. 调用方式：ctx.helper.createDebug(yourDebugName)
example:

``` sh
    DEBUG=HomeController.a,HomeController.b  npm run dev
```

``` js
    const debug = this.ctx.helper.createDebug('HomeController.a');
    const debug2 = this.ctx.helper.createDebug('HomeController.b');
    debug('licenses');
    this.ctx.body = 'hi, world';
    debug('licenses2');
    setTimeout(function () {
        debug2('sdfdsfsdfd');
        debug('ddddd');
        debug2('licenses24');
    },1000)
```

2. 命令行工具显示结果： debug名称 输出内容 距离上一个debug的时间
如上执行结果example:

    ``` sh
        HomeController.a licenses +0ms
        HomeController.a licenses2 +3ms
        HomeController.b sdfdsfsdfd +1s
        HomeController.a ddddd +0ms
        HomeController.b licenses24 +1ms
    ```

3. 我们可以通过 DEBUG 环境变量选择开启指定的调试代码，方便观测执行过程。如不配置环境变量的话，debug不会输出到命令行工具，即不会有输出

``` sh
    # DEBUG=type1,type2 npm run dev
    DEBUG=*Controller*  npm run dev
```

    通过显示结果，可以方便开发人员只针对需要输出的debug类型调试输出结果，并且跟踪执行顺序和执行时间，利于发现代码问题，提升性能。

4. debug输出配置项在 config/congig.XXX.js。默认开发环境下开启，生产环境下禁止

# 单元测试

## 运行单元测试

``` sh
    EGG_SERVER_ENV=local npm run test
```

##  测试框架:Mocha 断言库: power-assert
##  Controller 测试
Controller 在整个应用代码里面属于比较难测试的部分了，因为它跟 router 配置紧密相关， 我们需要利用 **app.httpRequest()** SuperTest 发起一个真实请求， 来将 Router 和 Controller 连接起来，并且可以帮助我们发送各种满足边界条件的请求数据， 以测试 Controller 的参数校验完整性。 **app.httpRequest()** 是 egg-mock 封装的 [SuperTest](https://github.com/visionmedia/supertest) 请求实例。
例如我们要给 app/controller/home.js：

``` js
    // app/router.js
    module.exports = app => {
      app.get('homepage', '/', 'home.index');
    };
    // app/controller/home.js
    exports.index = function* (ctx) {
      ctx.body = 'hello world';
    };
```

写一个完整的单元测试，它的测试代码 test/controller/home.test.js 如下：

``` js
    const assert = require('assert');
    const mock = require('egg-mock');
    describe('test/controller/home.test.js', () => {
      let app;
      before(() => {
        // 创建当前应用的 app 实例
        app = mock.app();
        // 等待 app 启动成功，才能执行测试用例
        return app.ready();
      });
      describe('GET /', () => {
        it('should status 200 and get the body', () => {
          // 对 app 发起 `GET /` 请求
          return app.httpRequest()
            .get('/')
            .expect(200) // 期望返回 status 200
            .expect('hello world'); // 期望 body 是 hello world
        });
        it('should send multi requests', function* () {
          // 使用 generator function 方式写测试用例，可以在一个用例中串行发起多次请求
          yield app.httpRequest()
            .get('/')
            .expect(200) // 期望返回 status 200
            .expect('hello world'); // 期望 body 是 hello world
          // 再请求一次
          const result = yield app.httpRequest()
            .get('/')
            .expect(200)
            .expect('hello world');
          // 也可以这样验证
          assert(result.status === 200);
        });
      });
    });
```
##  Service 测试
例如给 app/service/user.js

``` js
    module.exports = app => {
      return class User extends app.Service {
        async get(name) {
          return await userDatabase.get(name);
        }
      };
    };
```
编写单元测试：

``` js
    describe('get()', () => {
      // 因为需要异步调用，所以使用 generator function
      it('should get exists user', async function () {
        // 创建 ctx
        const ctx = app.mockContext();
        // 通过 ctx 访问到 service.user
        const user = await ctx.service.user.get('fengmk2');
        assert(user);
        assert(user.name === 'fengmk2');
      });
      it('should get null when user not exists', async function () {
        const ctx = app.mockContext();
        const user = await ctx.service.user.get('fengmk1');
        assert(!user);
      });
    });
```
ddd

### git hooks
git钩子函数可以对提交操作添加钩子，添加格式校验和冲突文件校验等校验文件，保证git分支正常

使用npm包pre-commit，在package.json文件中添加 pre-commit参数，同时添加script，git提交是自动走钩子
[pre-commit](https://github.com/observing/pre-commit) **被弃用**
[husky](https://github.com/typicode/husky)
使用该方法可以调用构建工具自动构建发布等操作，是在自动化中很方便的操作
在 git commit的时候，这个钩子函数被调用；也可以在命令中添加 --no-verify参数来跳过钩子。这个钩子有一个参数，就是被选定的提交消息文件的名字。如果这个钩子的执行结果是非0，那么git commit 命令就会终止执行

[validate-commit-msg](https://github.com/conventional-changelog/validate-commit-msg) 用于检查 Node 项目的 Commit message 是否符合格式。

[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时， Change log 就可以用脚本自动生成（例1，例2，例3）。

生成的文档包括以下三个部分。

New features

Bug fixes

Breaking changes.

每个部分都会罗列相关的 commit ，并且有指向这些 commit 的链接。当然，生成的文档允许手动修改，所以发布前，你还可以添加其他内容。
