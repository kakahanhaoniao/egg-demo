'use strict';
const BaseException = require('./BaseException');
const commonError = {
    xs0403: '登录超时，请重新登录',
    xs0002: '用户名或密码错误',
    xs0000: '会员中心业务请求参数错误',
    xs0001: '会员基础信息异常',
    xs0003: '禁用会员失败（只能禁用已冻结的会员）',
    xs0004: '用户角色等级错误',
    xs0005: '用户不存在',
    xs0006: '用户已存在'
};
class AuthenticaionFailException extends BaseException {

    constructor(name, msg) {
        if (name && !msg) {
            msg = commonError[name];
        }
        super(name, msg);
    }
}

module.exports = AuthenticaionFailException;
