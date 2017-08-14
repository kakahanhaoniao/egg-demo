'use strict';
const BaseException = require('./BaseException');
class ValidateException extends BaseException {
    /**
    * @param {string} name 状态码
    * @param {object} msg 验证错误对象
    */
    constructor(name, msg) {
        const resMsg = {
            errorMsg: msg.errors,
            errorType: msg.message
        };
        super(name, resMsg);
    }
}

module.exports = ValidateException;
