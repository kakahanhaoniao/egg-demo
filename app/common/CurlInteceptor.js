'use strict';
const {
    AuthenticaionFailException,
    ServerFailException,
    CommonInterfaceFailException
} = require('../exception');
class CurlInteceptor {
    constructor(app) {
        this.app = app;
    }
    // 公共状态处理
    setCommonStatus(result /** url, options*/) {
        // 判断接口返回状态5XX
        if (String(result.status).match(/^5\d{2}$/)) {
            result.data.statusCode = 'xs0500';
        }
        switch (result.data.statusCode) {
        case 'xs0403':
            throw new AuthenticaionFailException(result.data.statusCode);
        case 'xs0500':
                // FIXME 何种状态说明服务器出错待定
                // result = await this.getCache(url, options);
                // if (!result) {
                //     throw new ServerFailException(result.data.statusCode);
                // }
                // return result;
            throw new ServerFailException(result.data.statusCode);
        case 'xs0402':
            throw new CommonInterfaceFailException(result.data.statusCode);
        default:
                // 默认全部设置为缓存
                // this.setCatche(url, options, result.data);
            return result;
        }
    }
    afterResponse(url, options, data /** wrapper*/) {
        // 设置通用状态处理请求（error抛出错误，正常返回请求结果数据）
        try {
            data = this.setCommonStatus(data, url, options);
            // 接口请求服务成功
            this.app.logger.info('curl:%s success', url);
            return data;
        } catch (err) {
            throw err;
        }
    }
    async beforeRequest(url, options, wrapper) {
        // if (!(wrapper._ctx.state.user && wrapper._ctx.state.cookie)) {
        //     const loginResult = await wrapper._ctx.service.user.checkLogin();
        //     if (!loginResult.statusCode === '2000000') {
        //         wrapper._ctx.state.user = loginResult.data;
        //     }
        // }
    }
    getName() {}
    isEnabled() {}
    getMatchReg() {}
}
module.exports = CurlInteceptor;
