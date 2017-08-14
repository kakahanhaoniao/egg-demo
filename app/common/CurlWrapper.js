'use strict';
const {
    AuthenticaionFailException,
    ServerFailException,
    CommonInterfaceFailException,
    BaseException
} = require('../exception');
const qs = require('querystringify');

class CurlWrapper {
    constructor(ctx, server) {
        this.ctx = ctx;
        this.server = server;
        this.enableHttpCache = ctx.app.config.enableHttpCache;
    }

    // 通过url和请求参数获取缓存
    async getCache(url, options) {
        if (this.ctx.session.userId) {
            const result = await this.ctx.app.cache.getByUser(this.ctx.session.userId, url + qs.stringify(options.data));
            if (result) {
                return result;
            }
        }
    }

    // 通过url和请求参数设置缓存
    setCatche(url, options, data) {
        if (this.ctx.session.userId) {
            this.ctx.app.cache.setByUser(this.ctx.session.userId, url + qs.stringify(options.data), JSON.stringify(data));
        }
    }

    // 公共状态处理
    async setCommonStatus(result, url, options) {
        // 判断接口返回状态5XX
        if (String(result.status).match(/^5\d{2}$/)) {
            result.data.statusCode = 'xs0500';
        }
        switch (result.data.statusCode) {
        case 'xs0403':
            throw new AuthenticaionFailException(result.data.statusCode);
        case 'xs0500':
                // FIXME 何种状态说明服务器出错待定
            result = await this.getCache(url, options);
            if (!result) {
                throw new ServerFailException(result.data.statusCode);
            }
            return result;
        case 'xs0402':
            throw new CommonInterfaceFailException(result.data.statusCode);
        default:
                // 默认全部设置为缓存
            this.setCatche(url, options, result.data);
            return result.data;
        }
    }


    async curl(url, options = {}, cached = false) {
        // 对缓存的处理，如果命中直接返回
        if (cached && this.enableHttpCache) {
            const cachedData = await this.getCache(url, options);
            if (cachedData) {
                return cachedData;
            }
        }
        // mock配合swaggerMock生成
        // 设置请求头
        if (this.ctx.header.cookie || this.ctx.session.backcookie) {
            Object.assign(options, {
                headers: {
                    cookie: this.ctx.session.backcookie ? this.ctx.session.backcookie : this.ctx.header.cookie
                },
                dataType: 'json', // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
                contentType: 'json',
                // 15 秒超时
                timeout: 15000
            });
        }
        // this.ctx.logger.error(`dddddddddddddddddd ${this.ctx.session.backcookie}`)
        try {
            let result = await this.ctx.curl(this.server ? (this.server + url) : url, options);
            const cookies = result.headers['set-cookie'];
            if (cookies && cookies.length) {
                this.ctx.session.backcookie = cookies.join(';');
            } else if (!this.ctx.session.backcookie) {
                options.headers.cookie.split(';').forEach(cookie => {
                    if (cookie.indexOf('JSESSIONID=') >= 0) {
                        this.ctx.session.backcookie = cookie.replace(/\s*/, '') + ';';
                    }
                });
            }
            // 设置通用状态处理请求（error抛出错误，正常返回请求结果数据）
            try {
                result = await this.setCommonStatus(result, url, options);
                // 接口请求服务成功
                this.ctx.logger.info(`curl:${this.server}${url} success`);
                return result;
            } catch (err) {
                throw err;
            }
        } catch (err) {
            // 设置接口服务请求报错(包括请求超时错误)
            this.ctx.logger.error(`curl:${this.server}${url} error:${qs.stringify(err)}`);
            // 判断错误从内部方法抛出，而非接服务器接口抛出
            if (err instanceof BaseException) {
                throw err;
            } else {
                // 处理服务器接口抛出错误
                throw new ServerFailException('xs0500', {
                    errorType: err.name,
                    errorMsg: err.message
                });
            }
        }

    }

}

module.exports = CurlWrapper;
