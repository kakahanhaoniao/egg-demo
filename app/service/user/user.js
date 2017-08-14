'use strict';
// const md5 = require('md5');
const AuthenticaionFailException = require('../../exception/AuthenticaionFailException');
module.exports = app => {
    class UserService extends app.Service {
        constructor(ctx) {
            super(ctx);
            this.config = ctx.app.config;
            this.httpClient = ctx.getClient();
        }
        /**
        * @swagger
        * definitions:
        *   Error:
        *     description: 通过错误类型全局描述
        *     properties:
        *       statusCode:
        *         type: string
        *         description: 错误状态码
        *       errorMsg:
        *         type: string
        *         description: 错误消息
        *       errorType:
        *         type: string
        *         description: 错误类型
        */
        /**
        * @不支持oneOfswagger
        * definitions:
        *   Error:
        *     description: 通过错误类型全局描述
        *     oneOf:
        *       - properties:
        *          statusCode:
        *            type: string
        *            description: 错误状态码
        *          errorMsg:
        *            type: string
        *            description: 错误消息
        *          errorType:
        *            type: string
        *            description: 错误类型
        *       - properties:
        *          statusCode:
        *            type: string
        *            description: 错误状态码
        *          errorMsg:
        *            type: array
        *            description: 错误消息
        *          errorType:
        *            type: string
        *            description: 错误类型
        */
        /**
         * 检查用户是否已经登录
         * @return {Promise} 返回Promise对象的请求接口结果
         */
        async checkLogin() {
            return await this.httpClient.curl(this.config.servicesApi.user.checkLogin);
        }

        /**
         * 用户登录服务
         * @param {String} user 用户名
         * @param {string} password 密码
         * @return {object} 登录信息
         */
        async authorize(user, password) {
            const ctx = this.ctx;
            // 调用这个方法只是为了更新cookie。
            try {
                await this.checkLogin();
            } catch (err) {
                console.log('');
            }
            const loginResult = await this.httpClient.curl(this.config.servicesApi.user.login, {
                method: 'POST',
                data: {
                    loginUser: user,
                    // loginPwd: md5(password), 不能明文进行传输，防止http被拦截
                    loginPwd: password
                }
            });
            // 抛出基础错误
            if (loginResult.statusCode !== '2000000') {
                return ctx.app.translateToError(new AuthenticaionFailException(loginResult.statusCode));
            }
            ctx.state.user = loginResult.data.user.id;
            ctx.state.cookie = ctx.state.setcookie ? ctx.state.setcookie[0] : '';
            return loginResult;
        }

        /** 用户登出服务
        * @return {object} 返回成功
        */
        async logout() {
            const { statusCode } = await this.httpClient.curl(this.config.servicesApi.user.logout, {
                method: 'POST',
                data: {
                    // 获取state.user
                    id: this.ctx.state.user
                }
            });
            if (statusCode !== '2000000') {
                return this.ctx.app.translateToError(new AuthenticaionFailException(statusCode));
            }
            return {
                data: '用户退出登录成功'
            };
        }
    }
    return UserService;
};
