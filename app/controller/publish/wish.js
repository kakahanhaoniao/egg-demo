'use strict';
const {
    commonValidate,
    wishRules,
    commonPublish
} = require('../../validator');
const rules = {
    add: {
        mainProductId: 'string',
        siteType: {
            type: 'enum',
            values: [ '4' ]
        },
        siteId: 'string',
        userName: 'string'
    },
    edit: {
        id: 'string',
        siteType: {
            type: 'enum',
            values: [ '4' ]
        },
        siteId: 'string',
        userName: 'string',
        // 商品操作状态
        operateStatus: {
            type: 'object',
            required: true,
            rule: {
                status: {
                    type: 'enum',
                    values: [ '0', '1', '2', '3' ]
                },
                chkStatus: {
                    type: 'enum',
                    values: [ '0', '1', '2' ]
                },
                cronStatus: {
                    type: 'enum',
                    values: [ '0', '1', '2', '3', '4', '5', '', null ]
                },
                operateType: 'operateTypeCheck',
                operateMode: 'operateModeCheck',
                operateStage: 'operateStageCheck',
                platform: 'platformCheck'
            }
        }
    },
    save: {
        title: {
            type: 'string',
            max: 100
        },
        commoditylabel: 'sdsd,df,SD & SDHC Cards',
        site: 'string',
        categoryId: 'string',
        commodityId: 'string',
        color: 'string',
        size: 'string',
        sizeType: 'string',
        sku: 'string',
        addressId: 'string',
        msrprice: {
            type: 'string',
            required: false,
            allowEmpty: true
        },
        price: 'string',
        transittime: {
            type: 'string',
            required: false
        },
        stock: 'string',
        shipping: 'string',
        orderprocessingtime: 'string',
        description: 'string'
    }
};
module.exports = app => {
    class WishController extends app.Controller {
        constructor(ctx) {
            super(ctx);
            // 注册验证规则
            this.app.registRules([ commonValidate, wishRules, commonPublish ]);
        }

        /**
         * @swagger
         * tags:
         *   - name: Wish
         *     description: wish刊登模块
         */
        /**
         * @swagger
         * /wish/add:
         *   post:
         *     description: 获取wish新增刊登信息
         *     tags:
         *       - Wish
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: body
         *         in: body
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             mainProductId:
         *               type: string
         *               minimum: 32
         *               description: 主商品id
         *             siteType:
         *               type: string
         *               enum: ["4"]
         *               description: 站点类型： 1=> ebay 2=>amazon 3=>newegg 4=>wish
         *             siteId:
         *               type: string
         *               description: 站点id
         *             userName:
         *               type: string
         *               description: 用户名
         *     responses:
         *       200:
         *         description: wish平台刊登信息
         *         schema:
         *          type: object
         *          required:
         *            - mainProductInfo
         *            - blackWords
         *            - getCategoryPath
         *            - wmsStock
         *            - siteBaseInfo
         *            - shippingData
         *            - baseData
         *          properties:
         *            mainProductInfo:
         *              description: 主商品信息
         *              type: object
         *              $ref: '#/definitions/MainProductInfo'
         *            blackWords:
         *              description: 违禁词
         *              type: array
         *              items:
         *                type: string
         *                pattern: \w{5,20}
         *            getCategoryPath:
         *              type: string
         *              pattern: (\w{5,20}>){2,6}\w{5,20}
         *              description: 获取分类全路径
         *            wmsStock:
         *              type: array
         *              items:
         *                $ref: '#/definitions/WmsStock'
         *              description: 获取海外仓数据
         *            siteBaseInfo:
         *              description: 获取基础站点信息
         *              $ref: '#/definitions/SiteBaseInfo'
         *            shippingData:
         *              type: object
         *              description: 获取发货地址模板
         *              properties:
         *                cPageNO:
         *                  type: integer
         *                pageSize:
         *                  type: integer
         *                totalCount:
         *                  type: integer
         *                totalPages:
         *                  type: integer
         *                list:
         *                  type: array
         *                  items:
         *                    $ref: '#/definitions/Shippingaddress'
         *            baseData:
         *              type: array
         *              description: wish刊登基础信息
         *              items:
         *                $ref: '#/definitions/WishBaseData'
         *            relateImages:
         *              type: object
         *              description: 关联图片信息
         *              properties:
         *                imageId:
         *                  type: object
         *                  properties:
         *                    first:
         *                      type: object
         *                      description: 主图
         *                      $ref: '#/definitions/ImageBelongInfo'
         *                    last:
         *                      type: object
         *                      description: 副图
         *                      $ref: '#/definitions/ImageBelongInfo'
         *                    list:
         *                      type: array
         *                      description: 关联图片列表
         *                      items:
         *                        $ref: '#/definitions/ImageBelongInfo'
         *
         */

        async add() {
            const ctx = this.ctx;
            ctx.validateWithThrow(rules.add, ctx.request.body);
            const {
                mainProductId,
                siteType,
                siteId,
                userName
            } = ctx.request.body;
            let blackWords,
                getCategoryPath,
                wmsStock,
                siteBaseInfo,
                shippingData,
                baseData,
                relateImages;
            // 获取主商品信息
            try {
                // 获取主商品信息
                const mainProductInfo = await ctx.service.product.mainProduct.mainProductInfo(mainProductId);
                // 主商品出错
                if (mainProductInfo.statusCode) {
                    ctx.body = mainProductInfo;
                    return;
                }
                // 主商品成功
                const {
                    categoryId,
                    userId
                } = mainProductInfo;
                // 获取sku值和关联图片id
                const {
                    skus,
                    imageIds
                } = this.checkSkuAndImages(mainProductInfo);
                try {
                    [ blackWords, getCategoryPath, wmsStock, siteBaseInfo, shippingData, baseData, relateImages ] = await this.bachInterface(userName, siteType, categoryId, skus, siteId, userId, imageIds);
                } catch (err) {
                    throw err;
                }
                ctx.success({
                    mainProductInfo,
                    blackWords,
                    getCategoryPath,
                    wmsStock,
                    siteBaseInfo,
                    shippingData,
                    baseData,
                    relateImages
                });
            } catch (err) {
                throw err;
            }
        }
        /**
         * @swagger
         * /wish/edit:
         *   post:
         *     description: 获取wish编辑商品刊登信息
         *     tags:
         *       - Wish
         *     produces:
         *       - application/json
         *     parameters:
         *       - name: body
         *         in: body
         *         required: true
         *         schema:
         *           type: object
         *           properties:
         *             id:
         *               type: string
         *               minimum: 32
         *               description: wish商品id
         *             siteType:
         *               type: string
         *               enum: ["4"]
         *               description: 站点类型： 1=> ebay 2=>amazon 3=>newegg 4=>wish
         *             siteId:
         *               type: string
         *               description: 站点id
         *             userName:
         *               type: string
         *               description: 用户名
         *             operateStatus:
         *               type: object
         *               description: 站点商品操作6个状态
         *               properties:
         *                 status:
         *                   type: string
         *                   enum: ['0', '1', '2', '3']
         *                   description: 主状态
         *                 chkStatus:
         *                   type: string
         *                   description: 审核状态
         *                   enum: ['0', '1', '2']
         *                 cronStatus:
         *                   type: string
         *                   description: 定时状态
         *                   enum: ['0', '1', '2', '3', '4', '5', '', null]
         *                 operateType:
         *                   type: string
         *                   enum: ['EndManual', 'CheckPublish', 'Delete', 'End', 'Relist', 'UpdateActive', 'UpdateActiveAddress', 'UpdateActivePrice', 'UpdateActivePublish', 'UpdateActiveShipping', 'UpdateActiveStock', 'UpdateEnd', 'UpdateEndPublish', '', null]
         *                   description: 操作类型
         *                 operateMode:
         *                   type: string
         *                   enum: ['Update', 'Publish', '', null]
         *                 operateStage:
         *                   type: string
         *                   enum: ['UpdateBaseInfo', 'UpdateStockPrice', '', null]
         *                 platform:
         *                   type: string
         *                   enum: ['ebay', 'amazon', 'newegg', 'wish', 'cd']
         *                   description: 平台
         *     responses:
         *       200:
         *         description: wish平台刊登信息
         *         schema:
         *          type: object
         *          required:
         *            - mainProductInfo
         *            - blackWords
         *            - getCategoryPath
         *            - wmsStock
         *            - siteBaseInfo
         *            - shippingData
         *            - baseData
         *            - wishInfo
         *          properties:
         *            wishInfo:
         *              description: wish刊登商品信息
         *              type: object
         *              $ref: '#/definitions/WishInfo'
         *            mainProductInfo:
         *              description: 主商品信息
         *              type: object
         *              $ref: '#/definitions/MainProductInfo'
         *            blackWords:
         *              description: 违禁词
         *              type: array
         *              items:
         *                type: string
         *                pattern: \w{5,20}
         *            getCategoryPath:
         *              type: string
         *              pattern: (\w{5,20}>){2,6}\w{5,20}
         *              description: 获取分类全路径
         *            wmsStock:
         *              type: array
         *              items:
         *                $ref: '#/definitions/WmsStock'
         *              description: 获取海外仓数据
         *            siteBaseInfo:
         *              description: 获取基础站点信息
         *              $ref: '#/definitions/SiteBaseInfo'
         *            shippingData:
         *              type: array
         *              description: 获取发货地址模板
         *              items:
         *                $ref: '#/definitions/Shippingaddress'
         *            baseData:
         *              type: array
         *              description: wish刊登基础信息
         *              items:
         *                $ref: '#/definitions/WishBaseData'
         *            relateImages:
         *              type: object
         *              description: 关联图片信息
         *              properties:
         *                imageId:
         *                  type: object
         *                  properties:
         *                    first:
         *                      type: object
         *                      description: 主图
         *                      $ref: '#/definitions/ImageBelongInfo'
         *                    last:
         *                      type: object
         *                      description: 副图
         *                      $ref: '#/definitions/ImageBelongInfo'
         *                    list:
         *                      type: array
         *                      description: 关联图片列表
         *                      items:
         *                        $ref: '#/definitions/ImageBelongInfo'
         *
         */
        async edit() {
            const ctx = this.ctx;
            ctx.validateWithThrow(rules.edit, ctx.request.body);
            const {
                id,
                siteType,
                siteId,
                userName,
                operateStatus
            } = ctx.request.body;
            let wishInfo,
                mainProductInfo,
                blackWords,
                getCategoryPath,
                wmsStock,
                siteBaseInfo,
                shippingData,
                baseData,
                relateImages,
                mainProductId;
            // 判断是否编辑状态，获取wish编辑详情
            try {
                wishInfo = await ctx.service.publish.wish.wishEditInfo(id, operateStatus);
                mainProductId = wishInfo.commodityId;
                const {
                    categoryId,
                    userId
                } = wishInfo;
                // 获取sku值和关联图片id
                const {
                    skus,
                    imageIds
                } = this.checkSkuAndImages(wishInfo);
                try {
                    [ blackWords, getCategoryPath, wmsStock, siteBaseInfo, shippingData, baseData, relateImages, mainProductInfo ] = await this.bachInterface(userName, siteType, categoryId, skus, siteId, userId, imageIds, mainProductId);
                } catch (err) {
                    throw err;
                }
                // 接口成功
                ctx.success({
                    wishInfo,
                    mainProductInfo,
                    blackWords,
                    getCategoryPath,
                    wmsStock,
                    siteBaseInfo,
                    shippingData,
                    baseData,
                    relateImages
                });
            } catch (err) {
                throw err;
            }
        }

        /** 处理关联图片
         * @param {Object} data 要处理的数据（主商品info/wish info）
         * @return {Object} sku和image关联id的组合
         */
        checkSkuAndImages(data) {
            const skus = new Set();
            const imageIds = new Set();
            // 添加sku和id
            imageIds.add(data.id);
            skus.add(data.sku);
            // 判断主商品是否为多规格,并获取sku值
            if (data.variationType !== 'singleVariation') {
                data.commodityVariations.forEach(vary => {
                    imageIds.add(vary.variationId);
                    skus.add(vary.variationSku);
                });
            }
            return {
                skus,
                imageIds
            };
        }

        /** 处理公共接口
         * @param {string} userName 用户名
         * @param {string} siteType 站点类型  =>4
         * @param {string} categoryId 分类id
         * @param {Object<set>} skus sku{set对象}
         * @param {string} siteId 站点id
         * @param {string} userId 用户id
         * @param {Object<set>} imageIds 图片关联id{set对象}
         * @param {string} mainProductId 主商品id
         * @return {Object<promise>} 多个接口promise对象
         */
        async bachInterface(userName, siteType, categoryId, skus, siteId, userId, imageIds, mainProductId) {
            const ctx = this.ctx;
            const promiseArgs = [
                // 获取违禁词
                ctx.service.publish.commonPublishService.blackWords(userName, siteType),
                // 获取分类路径
                ctx.service.publish.commonPublishService.getCategoryPath(categoryId),
                // 获取海外仓刊登量
                ctx.service.publish.commonPublishService.wmsStock([ ...skus ]),
                // 获取站点siteInfo基础信息
                ctx.service.publish.commonPublishService.siteBaseInfo(siteId),
                // 获取发货地址模板数据
                ctx.service.template.shippingaddress.shippingaddressList(userId, [ '2', '3' ]),
                // 获取wish刊登基础数据
                ctx.service.publish.wish.baseData(siteId, '2'),
                // 获取关联图片
                ctx.service.image.getImages([ ...imageIds ])
            ];
            // 判断主商品id，是否获取主商品信息
            if (mainProductId) {
                // 获取主商品信息
                promiseArgs.push(ctx.service.product.mainProduct.mainProductInfo(mainProductId));
            }
            try {
                return await Promise.all(promiseArgs);
            } catch (err) {
                throw err;
            }
        }
    }
    return WishController;
};
