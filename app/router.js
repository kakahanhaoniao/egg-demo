'use strict';
// const isLogin = require('./middleware/router/isLogin');
module.exports = app => {
    const EGGENV = app.config.env || (process.env.NODE_ENV === 'production' ? 'prod' : 'local');
    // FIXME 通过app.middlewares调用中间件的方式存在问题， 不能获取Context 对象的实例
    // const gzip = app.middlewares.gzip({ threshold: 1024 });
    app.get('/', 'home.index');
    app.get('/user/check', 'user.user.check');
    app.post('/user/login', 'user.user.login');
    app.get('/user/logout', 'user.user.logout');
    app.get('/user/clearcache', 'user.user.clearUserCache');
    app.get('/menu/getMenu', 'user.menu.getMenu');
    // 获取wish新增刊登信息
    app.post('/wish/add', 'publish.wish.add');
    // 获取wish编辑刊登信息
    app.post('/wish/edit', 'publish.wish.edit');
    app.get('/doc', 'mock.show');
    // 图片模块
    app.post('/image/albums', 'image.albumList');
    app.post('/image/albums/pictures', 'image.getPictures');
    app.get('/image/view', 'image.proxyView');

    // 生产环境下禁止菜单的如下接口
    if (EGGENV !== 'prod') {
        app.post('/menu/setMenu', 'user.menu.setMenu');
        app.post('/menu/editMenu', 'user.menu.editMenu');
        app.post('/menu/delMenu', 'user.menu.delMenu');
        app.get('/menu/menuInfo/:id', 'user.menu.menuInfo');
        // ssr
        app.get('/menu(/.+)?', 'user.menu.menuList');
    }
};
