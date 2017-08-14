'use strict';
const path = require('path');
module.exports = appInfo => {
    const config = {};
    // 选择使用的插件
    config.middleware = [ 'gzip', 'compress', 'responstime', 'swaggerMock', 'authorize', 'exception' ];
    // 是否开启调试debug
    config.debug = true;

    config.static = {
        prefix: '/public/',
        dir: [
            path.join(appInfo.root, './public/swagger')
        ]
    };

    // swagger配置项
    config.swagger = {
        enable: true,
        swaggerDefinition: {
            info: { // API informations (required)
                title: 'node中间层实践', // Title (required)
                version: '1.0.0', // Version (required)
                description: 'node sample API' // Description (optional)
            }
        },
        apis: [ path.resolve(appInfo.root, 'app/controller/*.js'), path.resolve(appInfo.root, 'app/controller/*/*.js'), path.resolve(appInfo.root, 'app/service/*.js'), path.resolve(appInfo.root, 'app/service/*/*.js') ]
    };

    // swaggerMock配置项
    config.swaggerMock = {
        enable: true,
        parameters: {
            response: 'httpStatus',
            checkMock: 'debugger'
        },
        match(ctx) {
            return ctx.query.hasOwnProperty([ config.swaggerMock.parameters.checkMock ]);
        }
    };
    // 日志分为 NONE，DEBUG，INFO，WARN 和 ERROR 5 个级别。
    config.logger = {
        level: 'DEBUG',
        dir: path.resolve(appInfo.root, 'logs'),
        consoleLevel: 'DEBUG',
        // outputJSON: true,
        appLogName: 'app-web.log',
        // "appLogName":`${appInfo.name}-web.log`,
        coreLogName: 'coreLog.log',
        agentLogName: 'agentLog.log',
        errorLogName: 'error.log'
    };

    // 设置自定义日志
    // config.customLogger = {
    //     AccessLogger: {
    //         file: path.resolve(appInfo.root, 'logs/access.log'),
    //     },
    // };

    // 配置连接的服务器
    config.server = {
        platform: 'http://127.0.0.1:8080',
        search: 'http://127.0.0.1:8084',
        image: 'http://127.0.0.1:8090'
    };

    // redis配置
    config.cache = {
        client: {
            host: '127.0.0.1',
            port: 6379
        }
    };

    // mongo 配置
    config.mongoose = {
        url: 'mongodb://127.0.0.1/xs',
        options: {}
    };
    // esay-monitor配置
    config.monitor = {
        enable: false,
        option: {
            project_name: 'node',
            need_document: true,
            auth: {
                need: true,
                authentication: require('../monitor/auth')
            }
        }
    };

    config.development = {
        watchDirs: [ 'build' ], // 指定监视的目录（包括子目录），当目录下的文件变化的时候自动重载应用，路径从项目根目录开始写
        ignoreDirs: [ 'app/web', 'public', 'config' ] // 指定过滤的目录（包括子目录）
    };

    config.vuessr = {
        injectCss: false
    };

    config.webpack = {
        webpackConfigList: [
            require(path.join(appInfo.baseDir, 'build/client')),
            require(path.join(appInfo.baseDir, 'build/server')),
            require(path.join(appInfo.baseDir, 'build/html'))
        ]
    };
    return config;
};
