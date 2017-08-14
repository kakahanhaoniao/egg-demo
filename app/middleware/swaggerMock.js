'use strict';
const Swagmock = require('swagmock');
module.exports = options => {
    return function* (next) {
        // 判断swagger是否开启 且请求参数包含debugger
        if (this.swaggerSpec && this.query.hasOwnProperty([ options.parameters.checkMock ])) {
            const Mockgen = Swagmock(this.swaggerSpec);
            const querySatus = this.query[options.parameters.httpStatus];
            const responseStatus = querySatus ? querySatus : 200;
            const method = this.method.toLocaleLowerCase();
            const mockData = yield Mockgen.responses({
                path: this.path,
                operation: method,
                response: responseStatus
            });
            this.body = mockData.responses;
        } else {
            yield next;
        }
    };
};
