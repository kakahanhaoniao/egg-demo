'use strict';
const mock = require('egg-mock');
const assert = require('assert');

describe('test/app/service/publish/wish.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
        return app.ready();
    });
    afterEach(mock.restore);
    // after(() => app.close());

    it('获取wish刊登基础信息成功', async () => {
        // 创建 ctx
        const ctx = app.mockContext();
        await ctx.service.user.user.authorize('lvweifang', '388cafd957a13f27666d606cbb62bd4a');
        // 通过 ctx 访问到 service.user
        const wishBaseData = await ctx.service.publish.wish.baseData('XBNZD026');
        assert(!wishBaseData.statusCode);
    });
});
