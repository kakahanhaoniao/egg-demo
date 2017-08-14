'use strict';
const path = require('path');
const fs = require('fs');
module.exports = appInfo => {
    const config = {};

    // should change to your own
    config.keys = appInfo.name + '_1494405938764_4929';

    // 是否启用http缓存
    config.enableHttpCache = true;

    config.logrotator = {
        maxFileSize: 12,
        maxFiles: 10,
        rotateDuration: 2,
        // for clean_log
        maxDays: 31
    };

    // 认证失败中间件
    config.exception = {
        match: '/'
    };
    // 是否启用csrf安全
    config.security = {
        csrf: false
    };


    // 内容压缩处理
    config.gzip = {
        threshold: 1024
    };


    config.compress = {
        threshold: 2048
    };

    config.i18n = {
      // 默认语言，默认 "en_US"
        defaultLocale: 'zh-CN'
    };


    //  HttpClient 默认全局配置
    config.httpclient = {
        // 默认开启 http/https KeepAlive 功能
        keepAlive: true,
        // 空闲的 KeepAlive socket 最长可以存活 4 秒
        freeSocketKeepAliveTimeout: 4000,
        // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
        timeout: 30000,
        // 允许创建的最大 socket 数
        maxSockets: Infinity,
        // 最大空闲 socket 数
        maxFreeSockets: 256,
        // 是否开启本地 DNS 缓存，默认关闭
        // 一旦设置开启，则每个域名的 DNS 查询结果将在进程内缓存 10 秒
        enableDNSCache: false
    };

    // 各业务模块相关配置
    config.servicesApi = {
        user: require('./serverApi/user.config'),
        // 刊登公共模块服务
        publishCommon: require('./serverApi/publish/publishCommon.config'),
        // wish模块服务
        wish: require('./serverApi/publish/wish.config'),
        // 图片模块
        image: require('./serverApi/image.config'),
        // 主商品模块
        mainProduct: require('./serverApi/product/mainProduct.config'),

        // 模板模块
        // 发货地址模板
        shippingaddress: require('./serverApi/template/shippingaddress.config')
    };

    // vue 配置项
    config.vue = {
        // renderOptions config, please @see https://ssr.vuejs.org/en/api.html#renderer-options
        renderOptions: {
         // template: '<!DOCTYPE html><html lang="en"><body><!--vue-ssr-outlet--></body></html>',

         // webpack vue ssr plugin build manifest file
         // clientManifest: require(path.join(app.baseDir,'public/vue-ssr-client-manifest.json')),
        }
    };

    config.siteFile = {
        '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/web/asset/images/favicon.ico'))
    };

    config.view = {
        cache: false
    };

    // config.vuessr = {
    //     layout: path.join(appInfo.baseDir, 'app/web/view/layout.html'),
    //     injectRes: [
    //         {
    //             inline: true,
    //             url: path.join(appInfo.baseDir, 'app/web/framework/inject/stat.js')
    //         }
    //     ]
    // };
    return config;
};
