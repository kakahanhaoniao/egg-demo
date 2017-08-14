'use strict';
const BasePublishException = require('../../exception/publish/BasePublishException');
module.exports = app => {
    class CommonPublishService extends app.Service {
        constructor(ctx) {
            super(ctx);
            this.config = ctx.app.config;
            this.httpClient = ctx.getClient();
            this.urls = this.config.servicesApi.publishCommon;
        }

        /** 获取各个站点违禁词
        * @param {string} userName 用户名
        * @param {string} siteType 站点类型(1,2,3,4,5,6)
        * @return {object} 违禁词数据
        */
        async blackWords(userName, siteType) {
            const ctx = this.ctx;
            const { data: balckWords, statusCode } = await this.httpClient.curl(`${this.urls.blackWords}${userName}/${siteType}`, {
                method: 'get',
                globalCache: true
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return ctx.app.translateToError(new BasePublishException(statusCode));
            }
            return balckWords;

        }

        /** 获取分类id的全路径
        * @param {string} id 分类id
        * @return {string|object} 分类路径
        */
        async getCategoryPath(id) {
            const ctx = this.ctx;
            const { data: path, statusCode } = await this.httpClient.curl(`${this.urls.getCategoryPath}${id}`, {
                method: 'get',
                globalCache: true
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return ctx.app.translateToError(new BasePublishException(statusCode));
            }
            return path;

        }
        /**
        * @swagger
        * definitions:
        *   WmsStock:
        *     description: 获取海外仓数据
        *     properties:
        *       userName:
        *         type: string
        *       storeCode:
        *         type: string
        *       sku:
        *         type: string
        *       num:
        *         type: integer
        *         minimum: 0
        *
        */
        /** 获取海外仓刊登量
        * @param {array} skus 要获取数量的sku
        * @return {object} 海外仓刊登量数据
        */
        async wmsStock(skus) {
            const ctx = this.ctx;
            const { data: wmsStock, statusCode } = await this.httpClient.curl(`${this.urls.wmsStock}`, {
                method: 'post',
                data: { skus }
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return ctx.app(new BasePublishException(statusCode));
            }
            return wmsStock;

        }
        /**
        * @swagger
        * definitions:
        *   SiteBaseInfo:
        *     description: 获取站点基础数据
        *     type: object
        *     properties:
        *       id:
        *         type: string
        *         pattern: XBNZD\d{3}
        *       cnName:
        *         type: string
        *         pattern: (Wish|Ebay|Amazon|Newegg)[\u4e00-\u9fa5]+
        *       enName:
        *         type: string
        *         pattern: \w{2,8}
        *       siteCode:
        *         type: string
        *         pattern: \w{2,8}
        *       platformCode:
        *         type: string
        *         enum: ['1','2','3','4','5','6']
        *       platformValue:
        *         type: string
        *         enum: ['ebay','amazon','newegg', 'wish','cd','mercado']
        *       countryCode:
        *         type: string
        *         pattern: XBNGJ\d{3}
        *       countryValue:
        *         type: string
        *       languageCode:
        *         type: string
        *         pattern: XBNYZ\d{2}
        *       languageValue:
        *         type: string
        *       currencyCode:
        *         type: string
        *         pattern: XBNHB\d{2}
        *       currencyValue:
        *         type: string
        *       currencyMark:
        *         type: string
        *         pattern: \w
        *       currencyAcronym:
        *         type: string
        *         pattern: \w{1,10}
        *       timeZone:
        *         type: string
        *         pattern: \w{1,10}
        *       imageMaxCount:
        *         type: integer
        *       imageFreeCount:
        *         type: integer
        *       packLengthUnit:
        *         type: string
        *       packLengthUnitMark:
        *         type: string
        *       packWeightUnit:
        *         type: string
        *       packWeightUnitMark:
        *         type: string
        *       commodityDescribeType:
        *         type: string
        *         enum: ['text']
        *       commodityPrefixUrl:
        *         type: string
        *         format: uri
        *       commissionrate:
        *         type: string
        */
        /** 获取站点基础信息
        * @param {string} siteId 站点id
        * @return {object} 站点基础信息信息
        */
        async siteBaseInfo(siteId) {
            const ctx = this.ctx;
            const { data: siteBaseInfo, statusCode } = await this.httpClient.curl(`${this.urls.siteBaseInfo}${siteId}`, {
                method: 'get',
                globalCache: true
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return ctx.app.translateToError(new BasePublishException(statusCode));
            }
            return siteBaseInfo;

        }

    }
    return CommonPublishService;
};
