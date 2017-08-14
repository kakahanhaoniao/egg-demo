'use strict';
const BaseException = require('./BaseException');
const commonError = {
    xs0402: '请求被拒绝，请求接口无权限'
};
class CommonInterfaceFailException extends BaseException {

    constructor(name, msg) {
        if (name && !msg) {
            msg = commonError[name];
        }
        super(name, msg);
    }

}

module.exports = CommonInterfaceFailException;
