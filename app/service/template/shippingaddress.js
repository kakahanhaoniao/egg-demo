'use strict';
const ShippingaddressException = require('../../exception/template/ShippingaddressException');
module.exports = app => {
    class shippingaddressService extends app.Service {
        constructor(ctx) {
            super(ctx);
            this.config = ctx.app.config;
            this.httpClient = ctx.getClient();
            this.urls = this.config.servicesApi.shippingaddress;
        }

        /**
        * @swagger
        * definitions:
        *   Shippingaddress:
        *     description: 发货地址模板
        *     properties:
        *       shipaddressid:
        *         type: integer
        *         format: int32
        *       templateType:
        *         type: string
        *         enum: ['1','2','3']
        *       tempName:
        *         type: string
        *       userID:
        *         type: string
        *       contacts:
        *         type: string
        *       company:
        *         type: string
        *       country:
        *         type: string
        *       city:
        *         type: string
        *       district:
        *         type: string
        *       cnStreet:
        *         type: string
        *       telephone:
        *         type: string
        *       isDefault:
        *         type: string
        *       warehouseCode:
        *         type: string
        *       cnContacts:
        *         type: string
        *       enContacts:
        *         type: string
        *       cnCompany:
        *         type: string
        *       enCompany:
        *         type: string
        *       province:
        *         type: string
        *       enStreet:
        *         type: string
        *       zipCode:
        *         type: string
        *       provinceEn:
        *         type: string
        *       cityEn:
        *         type: string
        *       districtEn:
        *         type: string
        *       provinceCn:
        *         type: string
        *       cityCn:
        *         type: string
        *       districtCn:
        *         type: string
        *       districtId:
        *         type: string
        *       countryCn:
        *         type: string
        */
        /** 获取发货模板列表
        * @param {string} userID 用户id
        * @param {array} templateType 模板类型数组，不传默认全部
        * @return {object} 发货模板列表数据
        */
        async shippingaddressList(userID, templateType) {
            const ctx = this.ctx;
            let { data: shippingaddressList, statusCode } = await this.httpClient.curl(`${this.urls.shippingaddressList}`, {
                method: 'post',
                data: { userID },
                userCache: true
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return ctx.app.translateToError(new ShippingaddressException(statusCode));
            }
            // 获取不同模板(为商品提供服务)
            if (templateType) {
                shippingaddressList = shippingaddressList.list.filter(tempObj => {
                    if (templateType.includes(tempObj.templateType)) {
                        return tempObj;
                    }
                    return false;
                });
            }
            return shippingaddressList;

        }
    }
    return shippingaddressService;
};
