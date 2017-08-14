'use strict';
const array_difference = require('lodash/difference');
const wishValidate = {
    // 验证促销价小于销售价(只定义到销售价上面)
    salePriceLtOriginPrice: (rule, value, obj) => {
        if ((obj.msrprice && Number(value) < Number(obj.msrprice)) || Number(value) < Number(obj.msrprice)) {
            return '销售价必须小于MSRP';
        }
    },

    // sku不能重复(定义到root上)
    skuIsUniq: (rule, value, obj) => {
        const skuArr = [ value ];
        let set;
        // 判断多规格
        if (obj.commodityVariations && obj.commodityVariations.length) {
            const len = obj.commodityVariations.length;
            obj.commodityVariations.forEach(vary => skuArr.push(vary.variationSku));
            set = [ ...new Set(skuArr) ];
            if (set.length < len) {
                return `sku:${array_difference(skuArr, set).join(' ')}重复`;
            }
        }
    }
};

module.exports = wishValidate;
