'use strict';
class BaseException {
    constructor(name, msg) {
        this._name = name;
        this._msg = msg;
    }
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get msg() {
        return this._msg;
    }

    set msg(value) {
        this._msg = value;
    }
}


module.exports = BaseException;
