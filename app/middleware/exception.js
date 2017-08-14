'use strict';
const { BaseException } = require('../exception');
const { getStatus } = require('../common/commonXbnStatus');
module.exports = (options, app) => {

    return function* (next) {
        try {
            yield next;
        } catch (err) {
            let rserr;
            // 默认http状态全部200
            if (err instanceof BaseException) {
                rserr = app.translateToError(err);
            } else {
                // 处理异常错误（通用）
                rserr = {
                    errorType: err.name,
                    statusCode: getStatus(err.name),
                    errorMsg: err.message
                };
            }
            this.body = rserr;
            app.logger.error(`acess:${this.url}  ${err.constructor.toString().split(' ')[1].split('(')[0]}Error:${JSON.stringify(err)}`);
        }
    };
};
