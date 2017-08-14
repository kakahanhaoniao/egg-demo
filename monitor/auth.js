'use strict';
/**
 * TODO 待后期需要添加用户权限
 * @param {string} user 用户名
 * @param {string} pass 用户键入密码
 * @return {promise} promise对象
 **/
function authentication(user, pass) {
    return new Promise(resolve => {
        if ((user === 'xiaoshao322' && pass === 'xbn888888')) resolve(true);
        else resolve(false);
    });
}
module.exports = authentication;
