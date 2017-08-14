'use strict';
const BaseException = require('./BaseException');
const commonError = {
    xs0500: '后台发生异常'
};
class ServerFailException extends BaseException {

    constructor(name, msg) {
        if (name && !msg) {
            msg = commonError[name];
        }
        super(name, msg);
    }

}

module.exports = ServerFailException;
