'use strict';
const mock = require('egg-mock');
const assert = require('assert');

describe('test/app/service/template/shippingaddress.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
        return app.ready();
    });
    afterEach(mock.restore);
    // after(() => app.close());

    it('获取发货模板列表成功', async () => {
        // 创建 ctx
        const ctx = app.mockContext();
        await ctx.service.user.user.authorize('lvweifang', '388cafd957a13f27666d606cbb62bd4a');
        // 通过 ctx 访问到 service.user
        const shippingaddressList = await ctx.service.template.shippingaddress.shippingaddressList('40289e5d50b269dc0150b69ce3ea000d', '3');
        assert(!shippingaddressList.statusCode);
    });
});
