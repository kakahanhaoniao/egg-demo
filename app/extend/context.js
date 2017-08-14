'use strict';
const {
    ValidateException
} = require('../exception');
const swaggerJSDoc = require('swagger-jsdoc');
// MULTIERROR 定义多接口调用某一个或者几个接口错误时，返回错误状态码
// VALIDERROR 校验错误状态码
const { MULTIERROR, VALIDERROR } = require('../common/commonXbnStatus');
module.exports = {
    // 设置读取swagger 并且读取api
    get swaggerSpec() {
        const options = this.app.config.swagger;
        if (options && options.enable) {
            return swaggerJSDoc(options);
        }
    },
    // control校验错误包装
    validateWithThrow() {
        const ctx = this;
        const args = Array.prototype.slice.call(arguments);
        // 将controller验证规则抛出信息I18n化(zh-CN)转义语言
        if (typeof this.app.validator.translate !== 'function') {
            this.app.validator.translate = function() {
                const args = Array.prototype.slice.call(arguments);
                // Assume there have I18n.t method for convert language.
                return ctx.__.apply(ctx, args);
            };
        }
        try {
            this.validate.apply(this, args);
        } catch (err) {
            throw new ValidateException(VALIDERROR, err);
        }
    },

    /** 处理合并多接口(返回成功)
    * @param {string|array|object} res 返回结果
    */
    success(res) {
        const ctx = this;
        ctx.body = res;
        // 判断res不存在statuscode
        if ((res && typeof res === 'object') && !Object.keys(res).includes('statusCode')) {
            const index = Object.values(res).find(obj => {
                return obj && typeof obj === 'object' && Object.keys(obj).includes('statusCode');
            });
            // 多接口合并状态
            if (index) {
                ctx.body.statusCode = MULTIERROR;
            }
        }
    },

    /** 接口返回失败
    * @param {string|array|object} res 返回结果
    */
    error(res) {
        const ctx = this;
        ctx.body = res;
    }

};
