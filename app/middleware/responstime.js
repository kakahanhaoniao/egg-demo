'use strict';
module.exports = (options, app) => {
    return function* (next) {
        const start = new Date();
        let ms = 0;
        yield next;
        ms = new Date() - start;
        app.logger.info(`${this.method} ${this.protocol} ${this.ip} ${this.originalUrl}  ${this.status}   ${ms}ms`);
    };
};
