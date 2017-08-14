'use strict';
module.exports = async app => {
    // 获取真实wish数据siteType 必须是4
    const loginResult = await app.httpRequest()
    .post('/user/login')
    .send({ userName: 'lvweifang', password: '388cafd957a13f27666d606cbb62bd4a' });
    return loginResult.body;
};
