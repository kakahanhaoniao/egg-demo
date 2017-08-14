'use strict';
const path = require('path');
module.exports = appInfo => {
    const config = {};
    // 选择使用的插件
    config.middleware = [ 'gzip', 'compress', 'responstime', 'authorize', 'exception' ];
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
    // mongo 配置
    config.mongoose = {
        enable: true,
        url: 'mongodb://127.0.0.1/xbn',
        options: {}
    };
    // esay-monitor配置
    config.monitor = {
        enable: false
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
    return config;
};
