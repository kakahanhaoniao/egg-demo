'use strict';
const path = require('path');
module.exports = appInfo => {
    const config = {};
    // 选择使用的插件
    config.middleware = [ 'gzip', 'compress', 'responstime', 'authorize', 'exception' ];
    // 是否开启调试debug
    config.debug = false;
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
        url: 'mongodb://127.0.0.1/xbn',
        options: {}
    };

    // esay-monitor配置
    config.monitor = {
        enable: true,
        option: {
            project_name: 'node',
            auth: {
                need: true,
                authentication: require('../monitor/auth')
            }
        }
    };

    config.static = {
        prefix: '/public/',
        dir: path.join(appInfo.baseDir, 'public')
    };
    return config;
};
