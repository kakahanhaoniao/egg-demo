'use strict';
const mock = require('egg-mock');
const assert = require('assert');

describe('test/app/controller/user.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
        return app.ready();
    });

    afterEach(mock.restore);
    // after(() => app.close());
    it('用户登录成功', async () => {
        const result = await app.httpRequest()
        .post('/user/login')
        // TODO 设置请求头cookie(必须真实cookie)
        .send({ userName: 'lvweifang', password: '388cafd957a13f27666d606cbb62bd4a' })
        .expect(200);
        assert(result.body.userId);
    });
    it('获取用户验证登录成功 GET /user/check', async () => {
        const { jID } = await require('../../auth')(app);
        const result = await app.httpRequest()
        .get('/user/check')
        .set({
            cookie: jID
        })
        .expect(200);
        assert(result.body.statusCode === '2000000');
    });

    it('用户登录用户名或密码错误', async () => {
        const result = await app.httpRequest()
        .post('/user/login')
        // TODO 设置请求头cookie(必须真实cookie)
        .send({ userName: 'lvweifang', password: '388cafd957a13f28666d606cbb62bd4a' })
        .expect(200);
        assert(result.body.statusCode === '2010002');
    });
});
