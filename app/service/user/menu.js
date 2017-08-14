'use strict';
const CommonModelException = require('../../exception/model/CommonModelException');
module.exports = app => {
    class MenuService extends app.Service {
        constructor(ctx) {
            super(ctx);
            this.config = ctx.app.config;
        }
        /**
        * @swagger
        * definitions:
        *   Menu:
        *     description: 菜单数据
        *     properties:
        *       menuName:
        *         type: string
        *         description: 菜单名
        *       url:
        *         type: string
        *         description: 菜单链接
        *       icon:
        *         type: string
        *         description: 菜单图标
        */
        // 获取菜单
        async getMenu() {
            try {
                const menu = await this.ctx.model.Menu.find({})
                .select('menuName url icon is_always_show is_join codeId parentId')
                .lean()
                .exec();
                return menu;
            } catch (err) {
                throw err;
            }
        }

        // 编辑菜单
        async editMenu(id, opt) {
            try {
                const menu = await this.ctx.model.Menu.findByIdAndUpdate(id, opt)
                .select('menuName url icon is_always_show is_join codeId parentId')
                .lean()
                .exec();
                return menu;
            } catch (err) {
                throw err;
            }
        }

        // 编辑菜单
        async menuInfo(id) {
            try {
                const menu = await this.ctx.model.Menu.findById(id)
                .select('menuName url icon is_always_show is_join codeId parentId')
                .lean()
                .exec();
                return menu;
            } catch (err) {
                throw err;
            }
        }

        /** 删除菜单
        * @param {string} id 菜单id
        * @return {boolean} 是否删除成功
        */
        async delMenu({ _id }) {
            try {
                const menu = await this.ctx.model.Menu.findByIdAndRemove(_id)
                .lean()
                .exec();
                if (!menu) {
                    throw new CommonModelException('xbnm02');
                }
                return menu;
            } catch (err) {
                throw err;
            }
        }

        /**
        * @swagger
        * definitions:
        *   MenuInfo:
        *     description: 菜单数据
        *     properties:
        *       _id:
        *         type: string
        *       menuName:
        *         type: string
        *         description: 菜单名
        *       url:
        *         type: string
        *         description: 菜单链接
        *       icon:
        *         type: string
        *         description: 菜单图标
        *       is_always_show:
        *         type: boolean
        *         description: 当前菜单是否一直显示
        *       is_join:
        *         type: boolean
        *         description: 是否入驻
        *       codeId:
        *         type: string
        *         description: 菜单权限对应id
        *       parentId:
        *         type: string
        *         description: 父级id
        */
        /** 添加菜单数据
        * @param {string} menuName 菜单名
        * @param {string} url 链接
        * @param {string} icon 菜单图标
        * @param {Boolean} is_always_show 是否总显示
        * @param {Boolean} is_join 是否是未入住
        * @param {Number} codeId 菜单id值
        * @param {Number} parentId 父级菜单id
        * @return {object} 添加的菜单数据
        */
        async setMenu({ menuName, url, icon, is_always_show = false, is_join = false, codeId, parentId }) {
            try {
                const Menu = this.ctx.model.Menu;
                const isContain = await Menu.find({
                    codeId
                });
                if (isContain.length === 0) {
                    return await Menu.create({
                        menuName,
                        url,
                        icon,
                        is_always_show,
                        is_join,
                        codeId,
                        parentId
                    });
                }
                throw new CommonModelException('xbnm01');
            } catch (err) {
                throw err;
            }
        }

    }
    return MenuService;
};
