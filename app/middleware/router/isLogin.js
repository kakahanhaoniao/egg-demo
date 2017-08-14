'use strict';
const isLogin = async (ctx, next) => {

    const checkLogin = await ctx.service.user.checkLogin();
    if (checkLogin.statusCode === '2000000') {
        await next();
    } else {
        ctx.body = checkLogin;
    }
};

module.exports = isLogin;
