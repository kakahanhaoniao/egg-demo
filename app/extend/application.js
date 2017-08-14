'use strict';
const BaseValidate = require('../validator/BaseValidate');
module.exports = {
    // 注册验证规则
    registRules(validateRules) {
        new BaseValidate(validateRules, this.validator);
    },
    // 重新包装返回的error到前端接收标准error
    translateToError(err) {
        const error = {
            statusCode: err.name,
            errorMsg: err.msg
        };
        // 判断error.msg 为对象,用于处理自定义错误（包含校验错误）
        if (err.msg instanceof Object) {
            error.errorMsg = err.msg.errorMsg;
            error.errorType = err.msg.errorType;
        }
        return error;
    }
};
