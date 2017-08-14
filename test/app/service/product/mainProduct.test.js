'use strict';
const mock = require('egg-mock');
const assert = require('assert');

describe('test/app/service/product/mainProduct.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
        return app.ready();
    });
    afterEach(mock.restore);
    // after(() => app.close());

    it('获取主商品信息成功', async () => {
        // 创建 ctx
        const ctx = app.mockContext();
        await ctx.service.user.user.authorize('lvweifang', '388cafd957a13f27666d606cbb62bd4a');
        // 通过 ctx 访问到 service.user
        const mainProduct = await ctx.service.product.mainProduct.mainProductInfo('ccf3fca27df14ecbba2cd4379b1456e3');
        assert(mainProduct);
    });
});
