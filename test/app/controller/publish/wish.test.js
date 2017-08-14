'use strict';
const mock = require('egg-mock');
const assert = require('assert');

describe('test/app/controller/publish/wish.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
        return app.ready();
    });

    afterEach(mock.restore);
    // after(() => app.close());
    // beforeEach(async () => {
    //     await app.httpRequest()
    //     // 获取真实wish数据siteType 必须是4
    //     .post('/user/login')
    //     .set({
    //         cookie: 'JSESSIONID=D5C7109450644A4FD9D3d6AD4FF80FBDC-n1.jvm-platform-140;',
    //     })
    //     .send({userName: '18500040201', password: '333333'})
    // });

    it('获取wish刊登数据通过 GET /wish/add', async () => {
        const { jID } = await require('../../../auth')(app);
        const result = await app.httpRequest()
        // 获取真实wish数据
        .post('/wish/add')
        .send({ mainProductId: 'ccf3fca27df14ecbba2cd4379b1456e3', siteType: '4', siteId: 'XBNZD026', userName: 'lvweifang' })
        .set({
            cookie: jID
        })
        .expect(200);
        // 判断是否返回相应数据
        assert(result.body.baseData instanceof Array);
        assert(result.body.blackWords instanceof Array);
        assert(typeof result.body.getCategoryPath === 'string');
        assert(result.body.mainProductInfo instanceof Object);
        assert(result.body.shippingData instanceof Object);
        assert(result.body.siteBaseInfo instanceof Object);
        assert(result.body.wmsStock instanceof Array);
    });
});
