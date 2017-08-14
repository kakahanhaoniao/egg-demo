/**
* created by liuhan
* update by xiaoshao 2017/5/26
*/
'use strict';
const ImageException = require('../exception/ImageException');
module.exports = app => {

    class ImageService extends app.Service {

        constructor(ctx) {
            super(ctx);
            this.httpClient = ctx.getClient('image');
        }

        /** 保存图片关联关系
        * @description
        * { belongFiled: 'sku', relation:{'sku1':[img1,img2,img3], 'sku2':[img11,img12,img13} }
        * @param {array} id_list 图片关系数组
        * @param {string} belongTo 需要关联图片信息的id
        * @return {object} 关联图片数据
        */
        async saveImageRelation(id_list, belongTo) {
            const config = this.ctx.app.config;
            const requestBody = this.getRelationArray(id_list, belongTo);
            const relateImages = await this.httpClient.curl(`${config.servicesApi.image.updateRelation}`, {
                method: 'POST',
                data: requestBody
            });
            return relateImages;
        }

        /**
        * @swagger
        * definitions:
        *   ImageBelongInfo:
        *     description: 图片关联数据模型
        *     properties:
        *       relBelong:
        *         description: 外键ID
        *         type: string
        *       sort:
        *         description: 排序字段
        *         type: string
        *       relFileId:
        *         description: 文件id
        *         type: string
        *       type:
        *         description: 类型 ： 0主图 1副图
        *         type: string
        *       fileOriginalurl:
        *         description: 图片url
        *         type: string
        */
        /**
         * 根据id列表获取对应的图片
         * @param {array} list 关联id列表
         * @return {object} 获取图片数据
         */
        async getImages(list) {
            const config = this.ctx.app.config;
            const { data: related, statusCode } = await this.httpClient.curl(`${config.servicesApi.image.relations}`, {
                method: 'POST',
                data: {
                    list
                }
            });

            // 抛出基础错误
            if (statusCode !== '2000000') {
                return this.ctx.app.translateToError(new ImageException(statusCode));
            }

            const result = {};
            // 将图片数据信息组装到订单之中
            for (const image of related) {
                if (result[image.relBelong]) {
                    result[image.relBelong].list.push(image);
                    result[image.relBelong].last = image;
                } else {
                    result[image.relBelong] = {
                        list: [ image ],
                        first: image
                    };
                }
            }
            return result;
        }

        /**
         * 获取相册列表
         * @param {object} page 分页请求对象
         * @param {string} isPage 是否分页
         * @param {object} query 查询参数对象
         * @return {object} 返回相册数据
         */
        async getAlbums({ page, isPage, query }) {
            const config = this.ctx.app.config;
            const { data: {
                list: albums
            }, statusCode } = await this.httpClient.curl(`${config.servicesApi.image.albums}`, {
                method: 'POST',
                data: {
                    page,
                    query,
                    isPage
                }
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return this.ctx.app.translateToError(new ImageException(statusCode));
            }
            return albums;
        }

        /**
         * 获取图片列表
         * @param {object} page 分页请求对象
         * @param {string} isPage 是否分页
         * @param {object} query 查询参数对象
         * @return {Promise.<{pictures: *, page: *}>} 返回图片列表数据
         */
        async getAlbumPictures({ page, isPage, query }) {
            const config = this.ctx.app.config;
            const { data: result, statusCode } = await this.httpClient.curl(`${config.servicesApi.image.albumPictures}`, {
                method: 'POST',
                data: {
                    page,
                    query,
                    isPage
                }
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return this.ctx.app.translateToError(new ImageException(statusCode));
            }
            return result;
        }


        getRelationArray(id_list, belongsTo) {
            const relations = [];
            for (let i = 0; i < id_list.length; i++) {
                const relation = {
                    fileId: id_list[i],
                    relBelong: belongsTo
                };
                if (i === 0) {
                    relation.type = '0';
                } else {
                    relation.type = '1';
                }
                relation.sort = i;

                relations.push(relation);
            }
            return {
                ids: [ belongsTo ],
                list: relations
            };
        }


    }
    return ImageService;
};
