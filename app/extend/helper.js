'use strict';
const debug = require('debug');
module.exports = {
    createDebug(type) {
        if (this.config.debug) {
            return debug(type);
        }
        return () => {
            console.log('debug被禁用');
        };

    }
};
