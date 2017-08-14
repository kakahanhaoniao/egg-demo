'use strict';
const mock = require('egg-mock');
describe('test/app/controller/home.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
        return app.ready();
    });

    afterEach(mock.restore);
    // after(() => app.close());

    it('测试默认 GET /', () => {
        return app.httpRequest()
        .get('/')
        .expect(200)
        .expect('hi, world');
    });
});
