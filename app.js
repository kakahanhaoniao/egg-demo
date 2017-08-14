'use strict';
const RedisService = require('xbn-redis-cache');
const CurlInteceptor = require('./app/common/CurlInteceptor');
module.exports = app => {
    // 引入esay-monitor
    const monitor = require('./monitor');
    monitor(app);
    app.beforeStart(function* () {
        try {
            app.cache = new RedisService();
            app.cache.setUp(app.config.redis);
            app.plugins.cache = app.cache;
        } catch (err) {
            app.logger.error(app.translateToError(err));
        }
        // 添加curl拦截器
        const curlInteceptor = new CurlInteceptor(app);
        app.plugins.httpClientInteceptors.requestInteceptors.push(curlInteceptor);
        app.plugins.httpClientInteceptors.responseInteceptors.unshift(curlInteceptor);
    });
};
