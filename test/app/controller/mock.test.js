'use strict';
const mock = require('egg-mock');
const assert = require('assert');
const swaggerJSDoc = require('swagger-jsdoc');
describe('test/app/controller/mock.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
        return app.ready();
    });

    afterEach(mock.restore);
    // after(() => app.close());

    it('获取saggerApi', async () => {
        const ctx = app.mockContext();
        const options = ctx.app.config.swagger;
        const swaggerSpec = swaggerJSDoc(options);
        assert(swaggerSpec.info.title === 'node中间层实践');
    });
});
