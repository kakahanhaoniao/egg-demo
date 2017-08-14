'use strict';
const { listToTree } = require('../../common/commonFunction');
module.exports = app => {
    // 设置校验规则
    const validateRule = {
        login: {
            userName: 'string',
            password: 'string'
        }
    };
    class UserController extends app.Controller {
        /**
        * @swagger
        * tags:
        *   - name: Users
        *     description: 用户中心模块
        */
        /**
         * @swagger
         * /user/check:
         *   get:
         *     description: 验证用户登录
         *     tags:
         *      - Users
         *     produces:
         *      - application/json
         *     responses:
         *       200:
         *         description: users
         *         schema:
         *           type: object
         *           properties:
         *             statusCode:
         *               type: string
         *               description: 状态码
         *             data:
         *               type: string
         *               description: 返回用户id
         */
        async check() {
            const ctx = this.ctx;
            const loginResult = await ctx.service.user.user.checkLogin();
            ctx.success(loginResult);
        }


        /**
         * @swagger
         * /user/login:
         *   post:
         *     description: 用户登录
         *     tags:
         *       - Users
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: body
         *         in: body
         *         description: List of user object
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             userName:
         *               type: string
         *               description: 用户名
         *             password:
         *               type: string
         *               description: 用户密码(加密后密码，防止http截取)
         *     responses:
         *       200:
         *         description: users登陆成功
         *         schema:
         *           type: object
         *           properties:
         *             userId:
         *               type: string
         *               description: 用户id
         *             activeStatus:
         *               type: string
         *               enum: ['in', 'un']
         *             menu:
         *               type: object
         *               description: 用户菜单数据
         *       default:
         *         description: 错误返回接口
         *         schema:
         *           $ref: '#/definitions/Error'
         */
        async login() {
            const ctx = this.ctx;
            const req = ctx.request.body;
            ctx.validateWithThrow(validateRule.login, req);
            const loginResult = await ctx.service.user.user.authorize(req.userName, req.password);
            if (loginResult.statusCode === '2000000') {
                try {
                    let menu = await ctx.service.user.menu.getMenu();
                    // 获取用户是否入驻状态
                    const { activeStatus } = this.checkUserType(loginResult.data.user);
                    menu = this.regroupMenu(activeStatus, loginResult.data.roles, menu);
                    ctx.success({
                        userId: this.ctx.state.user,
                        jID: this.ctx.state.cookie,
                        menu,
                        activeStatus
                    });
                } catch (err) {
                    throw err;
                }
            } else {
                ctx.error(loginResult);
            }
        }
        /**
         * @swagger
         * /user/logout:
         *   get:
         *     description: 用户登出
         *     tags:
         *       - Users
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: users退出成功
         *         schema:
         *           type: object
         *           properties:
         *             data:
         *               type: string
         *               enum: ['用户退出登录成功']
         */
        async logout() {
            try {
                this.ctx.success(await this.ctx.service.user.user.logout());
            } catch (err) {
                throw err;
            }
        }

        /**
         * @swagger
         * /user/clearcache:
         *   get:
         *     description: 清除用户缓存
         *     tags:
         *       - Users
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: 清除用户缓存成功
         *         schema:
         *           type: object
         *           properties:
         *             data:
         *               type: string
         *               enum: ['清除用户缓存成功']
         */
        async clearUserCache() {
            try {
                this.ctx.app.cache.clearUserCache(this.ctx.state.user);
                this.ctx.success({
                    data: '清除用户缓存成功'
                });
            } catch (err) {
                throw err;
            }
        }

        /** 重组菜单数据
        * @param {string} userType 用户是否入职 'in'=>入驻 'un'=>未入住
        * @param {array} roles 角色数据
        * @param {array} menu 自定义菜单的数据
        * @return {object} 返回菜单数据
        */
        regroupMenu(userType, roles = [], menu) {
            // 要和roles合并设置的菜单数据
            const menuObj = {};
            const prefix = 'xbnmenu';
            let increment = 0;
            // 使用显示的菜单
            const staticMenu = [];
            menu.forEach(m => {
                const userStatus = [ 'un', 'in' ];
                const index = userStatus.findIndex(v => {
                    return v === userType;
                });
                // 借助index值与is_join判断当前的菜单是否一致 （双等号）
                if (m.is_always_show && !!index === m.is_join) {
                    m.id = `${prefix}${increment++}`;
                    staticMenu.push(m);
                } else if (!!index === m.is_join) {
                    menuObj[m.codeId] = m;
                }
            });
            if (Object.keys(menuObj).length) {
                roles.forEach(role => {
                    if (menuObj[role.id]) {
                        Object.assign(role, menuObj[role.id]);
                    }
                });
            }
            // 合并静态数据
            roles.push(...staticMenu);
            const resMenu = listToTree(roles, 'id', 'parentId', 'childRouter', -1, [ 'menuName', 'icon', 'url', 'level', 'menuType' ], true, 'childBtn');
            return resMenu;
        }

        /** 判断用户类型
        * @param {string} auditStatus  开店审核状态（'0':尚未提交审核 '1':审核中 '2':审核通过 '3':审核驳回）
        * @return {object} 用户入驻/未入住
        */
        checkUserType({ auditStatus }) {
            // 获取用户当前入驻/未入住状态
            const activeStatus = auditStatus === '5' ? 'in' : 'un';
            return {
                activeStatus
            };
        }

  }
    return UserController;
};
