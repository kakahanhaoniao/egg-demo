'use strict';
const STATUS = {
    // node端未知错误(默认)
    DEFAULT: 'xs000',
    // 定义多接口调用某一个或者几个接口错误时，返回错误状态码
    MULTIERROR: 'xs444',
    // 校验错误状态码
    VALIDERROR: 'xs412',
    // 请求超时错误状态码
    ResponseTimeoutError: 'xs001',
    getStatus(name) {
        if (STATUS[name]) {
            return STATUS[name];
        }
        return STATUS.DEFAULT;
    }
};
module.exports = STATUS;
