'use strict';
const WishPublishException = require('../../exception/publish/WishPublishException');
const ProductInterface = require('xbn-publish-interface');
module.exports = app => {
    class WishService extends app.Service {
        constructor(ctx) {
            super(ctx);
            this.config = this.ctx.app.config;
            this.httpClient = ctx.getClient();
            this.urls = this.config.servicesApi.wish;
        }
        /**
         * @swagger
         * definitions:
         *   WishBaseData:
         *     description: wish站点基础信息
         *     properties:
         *       propertyId:
         *         type: string
         *         pattern: CID\d{5}
         *       propertyName:
         *         type: string
         *         description: 数据名称
         *       propertyValue:
         *         type: string
         *         description: 数据值
         *         pattern: (\w{3,8}###)+\w{3,8}\r\n
         *       size:
         *         type: string
         *       chestCm:
         *         type: string
         *       waistCm:
         *         type: string
         *       waistIn:
         *         type: string
         *       neckCm:
         *         type: string
         *       neckIn:
         *         type: string
         *       sleeveCm:
         *         type: string
         *       sleeveIn:
         *         type: string
         *       bustchestCm:
         *         type: string
         *       bustchestIn:
         *         type: string
         *       hipCm:
         *         type: string
         *       hipIn:
         *         type: string
         *       european:
         *         type: string
         *       footlengthIn:
         *         type: string
         *       footlengthCm:
         *         type: string
         *       isRequired:
         *         type: number
         *         enum: [1,0]
         *       isValid:
         *         type: string
         *         enum: ['1','0']
         *       isSpecification:
         *         type: string
         *         enum: ['1','0']
         *       site:
         *         type: string
         *       findType:
         *         type: number
         *         enum: [1,0]
         *       showType:
         *         type: string
         *       heightCm:
         *         type: string
         *       heightIn:
         *         type: string
         */
        /** 获取wish基础数据
         * @param {string} site 站点id
         * @return {Object} wish基础数据
         */
        async baseData(site) {
            const ctx = this.ctx;
            const {
                data: balckWords,
                statusCode
            } = await this.httpClient.curl(`${this.urls.baseData}`, {
                method: 'post',
                data: {
                    site
                },
                globalCache: true
            });
            // 抛出基础错误
            if (statusCode !== '2000000') {
                return ctx.app.translateToError(new WishPublishException(statusCode));
            }
            return balckWords;

        }
        /**
         * @swagger
         * definitions:
         *   WishInfo:
         *     description: 刊登的wish站点详情
         *     properties:
         *       brand:
         *         type: string
         *       id:
         *         type: string
         *       categoryId:
         *         type: string
         *       title:
         *         type: string
         *       commoditylabel:
         *         type: string
         *       addressId:
         *         type: string
         *       warehouseType:
         *         type: string
         *       description:
         *         type: string
         *       variationType:
         *         type: string
         *       msrprice:
         *         type: string
         *       price:
         *         type: string
         *       sku:
         *         type: string
         *       upc:
         *         type: string
         *       stock:
         *         type: string
         *       transittime:
         *         type: string
         *       shipping:
         *         type: string
         *       orderprocessingtime:
         *         type: string
         *       status:
         *         type: string
         *       createDate:
         *         type: string
         *       endDate:
         *         type: string
         *       endType:
         *         type: string
         *       endReason:
         *         type: string
         *       failurecount:
         *         type: string
         *       freezeType:
         *         type: string
         *       isdelete:
         *         type: string
         *       isdisplay:
         *         type: string
         *       issysstatus:
         *         type: string
         *       productId:
         *         type: string
         *       itemid:
         *         type: string
         *       lastUpdateDate:
         *         type: string
         *       publishDate:
         *         type: string
         *       color:
         *         type: string
         *       size:
         *         type: string
         *       sizeType:
         *         type: string
         *       sellerId:
         *         type: string
         *       account:
         *         type: string
         *       site:
         *         type: string
         *       userId:
         *         type: string
         *       commodityId:
         *         type: string
         *       isenable:
         *         type: string
         *       commodityChk:
         *         type: object
         *         properties:
         *           chkType:
         *             type: string
         *           chkReason:
         *             type: string
         *           chkStatus:
         *             type: string
         *           chkSubmitDate:
         *             type: string
         *           chkDate:
         *             type: string
         *           chkUserId:
         *             type: string
         *       commodityCron:
         *         type: object
         *         properties:
         *           cronType:
         *             type: string
         *           cronDate:
         *             type: string
         *           cronStatus:
         *             type: string
         *           cronReason:
         *             type: string
         *           nearCronTime:
         *             type: string
         *       commodityOperate:
         *         type: object
         *         properties:
         *           operateType:
         *             type: string
         *           operateMode:
         *             type: string
         *           operateStage:
         *             type: string
         *       isPromoted:
         *         type: string
         *       commodityVariations:
         *         type: object
         *         properties:
         *           variationId:
         *             type: string
         *           commodityId:
         *             type: string
         *           color:
         *             type: string
         *           size:
         *             type: string
         *           variationSku:
         *             type: string
         *           itemId:
         *             type: string
         *           variationPrice:
         *             type: string
         *           variationStock:
         *             type: string
         *           transittime:
         *             type: string
         *           variationState:
         *             type: string
         *           msrprice:
         *             type: string
         *           sizeType:
         *             type: string
         *       commoditySpecifics:
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
        /** 获取wish编辑详情
         * @param {string} id wish商品id
         * @param {Object} opt 商品状态对象
         * @param {string} opt.status 主状态
         * @param {string} opt.chkStatus 审核状态
         * @param {string} opt.cronStatus 定时状态
         * @param {string} opt.operateType 操作类型
         * @param {string} opt.operateMode operateMode
         * @param {string} opt.operateStage operateStage
         * @param {string} opt.platform 平台
         * @return {object} wish编辑详情数据
         */
        async wishEditInfo(id, opt) {
            const operateObj = new ProductInterface(opt);
            // 判断是否可编辑状态
            if (operateObj.urlEdit) {
                const {
                    data: wishInfo,
                    statusCode
                } = await this.httpClient.curl(operateObj.urlEdit.url, {
                    method: 'post',
                    data: {
                        id
                    },
                    userCache: true
                });

                // 抛出基础错误
                if (statusCode !== '2000000') {
                    throw new WishPublishException(statusCode);
                } else {
                    return wishInfo;
                }
            } else {
                throw new WishPublishException('9999999');
            }
        }
    }
    return WishService;
};
