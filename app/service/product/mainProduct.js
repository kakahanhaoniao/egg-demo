'use strict';
const ProductException = require('../../exception/product/ProductException');
module.exports = app => {
    class MainProductService extends app.Service {
        constructor(ctx) {
            super(ctx);
            this.config = ctx.app.config;
            this.httpClient = ctx.getClient();
            this.urls = this.config.servicesApi.mainProduct;
        }

        /**
        * @swagger
        * definitions:
        *   MainProductInfo:
        *     description: 获取主商品信息
        *     properties:
        *       id:
        *         type: string
        *       itemNum:
        *         type: string
        *       categoryId:
        *         type: string
        *       brand:
        *         type: string
        *       title:
        *         type: string
        *       commodityGroup:
        *         type: string
        *       quantityUnit:
        *         type: string
        *       stockType:
        *         type: string
        *       variationType:
        *         type: string
        *       sku:
        *         type: string
        *       stock:
        *         type: string
        *       price:
        *         type: string
        *       commodityVariations:
        *         type: array
        *         items:
        *           type: object
        *           properties:
        *             variationId:
        *               type: string
        *             variationNames:
        *               type: string
        *             variationValues:
        *               type: string
        *             variationSku:
        *               type: string
        *             variationPrice:
        *               type: string
        *             variationOriginalPrice:
        *               type: string
        *             variationStock:
        *               type: string
        *             variationImgs:
        *               type: string
        *             variationDesc:
        *               type: string
        *             isEnable:
        *               type: string
        *             commodityId:
        *               type: string
        *       remark:
        *         type: string
        *       commodityPics:
        *         type: string
        *       commodityLang:
        *         type: object
        *         properties:
        *           lang:
        *             type: string
        *           langTitle:
        *             type: string
        *           langDescription:
        *             type: string
        *           langRichDescTemplateId:
        *             type: string
        *           langRichDescription:
        *             type: string
        *       commodityPkg:
        *         type: object
        *         properties:
        *           pkgLength:
        *             type: integer
        *           pkgWidth:
        *             type: integer
        *           pkgHeight:
        *             type: integer
        *           pkgWeight:
        *             type: integer
        *       addressId:
        *         type: string
        *       isDraft:
        *         type: string
        *       isDelete:
        *         type: string
        *       srcType:
        *         type: string
        *       isAllowPublish:
        *         type: string
        *       userId:
        *         type: string
        *       userName:
        *         type: string
        *       createDate:
        *         type: string
        *       lastUpdateDate:
        *         type: string
        *       statistic:
        *         type: object
        *         properties:
        *           sites:
        *             type: string
        *           siteStock:
        *             type: string
        *           publishDate:
        *             type: string
        *           endDate:
        *             type: string
        *           checkSubmitDate:
        *             type: string
        *           checkDate:
        *             type: string
        *           statisticDate:
        *             type: string
        *       isTempDelete:
        *         type: string
        *       tempDeleteDate:
        *         type: string
        *       mainVariationName:
        *         type: string
        *       originalPrice:
        *         type: string
        *       totalPublishNum:
        *         type: string
        *       oneCategoryId:
        *         type: string
        *       twoCategoryId:
        *         type: string
        *       oneCategoryName:
        *         type: string
        *       twoCategoryName:
        *         type: string
        */

        /** 获取主商品信息
        * @param {string} id 主商品id
        * @return {object} 主商品数据
        */
        async mainProductInfo(id) {
            const ctx = this.ctx;
            const { data: mainProductInfo, statusCode } = await this.httpClient.curl(`${this.urls.mainProductEdit}`, {
                method: 'post',
                data: { id },
                userCache: true
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return ctx.app.translateToError(new ProductException(statusCode));
                // throw new ProductException(statusCode);
            }
            return mainProductInfo;

        }
    }
    return MainProductService;
};
