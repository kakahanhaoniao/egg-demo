'use strict';
const mock = require('egg-mock');
const assert = require('assert');

describe('test/app/service/publish/commonPublishService.test.js', () => {
    let app;
    let ctx;
    before(() => {
        app = mock.app();
        return app.ready();
    });
    beforeEach(async () => {
        // 创建 ctx
        ctx = app.mockContext();
        await ctx.service.user.user.authorize('lvweifang', '388cafd957a13f27666d606cbb62bd4a');
    });
    afterEach(mock.restore);
    // after(() => app.close());

    it('获取wish刊登违禁词成功', async () => {
        // 通过 ctx 访问到 service.user
        const blackWords = await ctx.service.publish.commonPublishService.blackWords('40289e5d50b269dc0150b69ce3ea000d', 'XBNZD026');
        assert(!blackWords.statusCode);
    });

    it('获取分类全路径成功', async () => {
        // 通过 ctx 访问到 service.user
        const getCategoryPath = await ctx.service.publish.commonPublishService.getCategoryPath('3525');
        assert(!getCategoryPath.statusCode);
    });

    it('获取海外仓刊登量成功', async () => {
        // 通过 ctx 访问到 service.user
        const wmsStock = await ctx.service.publish.commonPublishService.wmsStock([ 'laliqi' ]);
        assert(!wmsStock.statusCode);
    });

    it('获取某个站点基础信息成功', async () => {
        // 通过 ctx 访问到 service.user
        const siteBaseInfo = await ctx.service.publish.commonPublishService.siteBaseInfo('XBNZD026');
        assert(!siteBaseInfo.statusCode);
    });
});
