'use strict';
module.exports = app => {
    const commonValidate = {
        // is_always_show为false时，codeId不能为空，即
        checkIsShowWithCodeId: (rule, value, data) => {
            if (data.is_always_show && value) {
                return 'codeId只能为空';
            } else if (!data.is_always_show && !value) {
                return 'codeId为必填项';
            }
        },
        // is_always_show为false时，codeId不能为空，即
        checkIsShowWithParentId: (rule, value, data) => {
            if (!data.is_always_show && value) {
                return 'parentId只能为空';
            } else if (data.is_always_show && !value) {
                return 'parentId为必填项';
            }
        }
    };
    // 设置校验规则
    const validateRule = {
        setMenu: {
            menuName: 'string',
            url: { type: 'string', required: false },
            icon: 'string',
            is_always_show: 'boolean',
            parentId: { type: 'checkIsShowWithParentId', required: false },
            is_join: 'boolean',
            codeId: { type: 'checkIsShowWithCodeId', required: false }
        },
        editMenu: {
            _id: 'string',
            menuName: 'string',
            url: { type: 'string', required: false },
            icon: 'string',
            is_always_show: 'boolean',
            parentId: { type: 'checkIsShowWithParentId', required: false },
            is_join: 'boolean',
            codeId: { type: 'checkIsShowWithCodeId', required: false }
        },
        delMenu: {
            _id: 'string'
        }
    };
    class MenuController extends app.Controller {
        constructor(ctx) {
            super(ctx);
            // 注册验证规则
            this.app.registRules(commonValidate);
        }
        /**
        * @swagger
        * tags:
        *   - name: Menu
        *     description: 菜单设置
        */
        /**
         * @swagger
         * /menu/setMenu:
         *   post:
         *     description: 设置用户菜单
         *     tags:
         *       - Menu
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: body
         *         in: body
         *         description: List of user object
         *         required: true
         *         schema:
         *           type: object
         *           required:
         *             - menuName
         *             - icon
         *             - is_always_show
         *             - is_join
         *           properties:
         *             menuName:
         *               type: string
         *             url:
         *               type: string
         *             icon:
         *               type: string
         *             is_always_show:
         *               type: boolean
         *             parentId:
         *               type: integer
         *             is_join:
         *               type: boolean
         *             codeId:
         *               type: integer
         *     responses:
         *       200:
         *         description: 设置菜单成功
         *         schema:
         *           $ref: '#/definitions/MenuInfo'
         */
        async setMenu() {
            try {
                this.ctx.validateWithThrow(validateRule.setMenu, this.ctx.request.body);
                const menu = await this.ctx.service.user.menu.setMenu(this.ctx.request.body);
                this.ctx.success(menu);
            } catch (err) {
                throw err;
            }
        }

        /**
         * @swagger
         * /menu/getMenu:
         *   get:
         *     description: 获取用户设置菜单信息
         *     tags:
         *       - Menu
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: 获取用户菜单信息成功
         *         schema:
         *           type: array
         *           items:
         *             $ref: '#/definitions/MenuInfo'
         */
        async getMenu() {
            try {
                const menu = await this.ctx.service.user.menu.getMenu();
                this.ctx.success(menu);
            } catch (err) {
                throw err;
            }
        }

        /**
         * @swagger
         * /menu/delMenu:
         *   post:
         *     description: 获取用户设置菜单信息
         *     tags:
         *       - Menu
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
         *             _id:
         *               type: string
         *     responses:
         *       200:
         *         description: 删除成功
         *         schema:
         *           type: object
         *           properties:
         *             data:
         *               type: string
         *               enum: ['删除成功']
         */
        async delMenu() {
            try {
                this.ctx.validateWithThrow(validateRule.delMenu, this.ctx.request.body);
                const menu = await this.ctx.service.user.menu.delMenu(this.ctx.request.body);
                if (menu) {
                    this.ctx.success({
                        data: '删除成功'
                    });
                }
            } catch (err) {
                throw err;
            }
        }

        /**
         * @swagger
         * /menu/editMenu:
         *   post:
         *     description: 获取用户设置菜单信息
         *     tags:
         *       - Menu
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: body
         *         in: body
         *         description: List of user object
         *         required: true
         *         schema:
         *           $ref: '#/definitions/MenuInfo'
         *     responses:
         *       200:
         *         description: 修改成功
         *         schema:
         *           $ref: '#/definitions/MenuInfo'
         */
        async editMenu() {
            const req = this.ctx.request.body;
            try {
                this.ctx.validateWithThrow(validateRule.editMenu, req);
                // 删除request的id值
                const opt = Object.assign({}, req);
                delete opt.id;
                const menu = await this.ctx.service.user.menu.editMenu(req._id, opt);
                this.ctx.success(menu);
            } catch (err) {
                throw err;
            }
        }

        /**
         * @swagger
         * /menu/menuInfo/{id}:
         *   get:
         *     description: 获取某个菜单信息
         *     tags:
         *       - Menu
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: id
         *         in: path
         *         description: 菜单id
         *         required: true
         *         type: string
         *     responses:
         *       200:
         *         description: 获取菜单数据
         *         schema:
         *           $ref: '#/definitions/MenuInfo'
         */
        async menuInfo() {
            const req = this.ctx.params;
            try {
                const menu = await this.ctx.service.user.menu.menuInfo(req.id);
                this.ctx.success(menu);
            } catch (err) {
                throw err;
            }
        }

        * menuList() {
            yield this.ctx.render('menu/menu.js', { url: this.ctx.url.replace(/\/menu/, '') });
        }
  }
    return MenuController;
};
