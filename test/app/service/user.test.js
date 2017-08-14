'use strict';
const mock = require('egg-mock');
const assert = require('assert');

describe('test/app/service/publish/user.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
        return app.ready();
    });
    afterEach(mock.restore);
    // after(() => app.close());

    it('判断用户登录成功', async () => {
        // 创建 ctx
        const ctx = app.mockContext();
        await ctx.service.user.user.authorize('lvweifang', '388cafd957a13f27666d606cbb62bd4a');
        // 通过 ctx 访问到 service.user
        const checkLogin = await ctx.service.user.user.checkLogin();
        assert(checkLogin.statusCode === '2000000');
    });

    it('用户登录 成功', async () => {
        // 创建 ctx
        const ctx = app.mockContext();
        const loginResult = await ctx.service.user.user.authorize('lvweifang', '388cafd957a13f27666d606cbb62bd4a');
        assert(loginResult.statusCode === '2000000');
    });

    it('判断用户用户名或密码错误', async () => {
        // 创建 ctx
        const ctx = app.mockContext();
        const loginResult = await ctx.service.user.user.authorize('lvweifang', '388cafd957a13f27686d606cbb62bd4a');
        assert(loginResult.statusCode === '2010002');
    });
});
