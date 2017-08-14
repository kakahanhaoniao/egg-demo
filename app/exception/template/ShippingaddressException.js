'use strict';
const BaseException = require('../BaseException');
const commonError = {
    xs0101: '创建发送地址模板异常',
    xs0102: '编辑发送地址模板异常',
    xs0103: '显示发送地址模板列表异常',
    xs0104: '删除发送地址模板异常',
    xs0105: '显示发送地址模板信息异常'
};
class ShippingaddressException extends BaseException {

    constructor(name, msg) {
        if (name && !msg) {
            msg = commonError[name];
        }
        super(name, msg);
    }
}

module.exports = ShippingaddressException;
