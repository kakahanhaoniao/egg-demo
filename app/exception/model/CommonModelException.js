'use strict';
const BaseException = require('../BaseException');
const commonError = {
    demo01: '该数据已经存在',
    demo02: '该数据不存在'
};
class CommonModelException extends BaseException {

    constructor(name, msg) {
        if (name && !msg) {
            msg = commonError[name];
        }
        super(name, msg);
    }
}

module.exports = CommonModelException;
