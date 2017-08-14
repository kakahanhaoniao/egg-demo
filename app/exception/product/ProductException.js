'use strict';
const BaseException = require('../BaseException');
const errorStatus = {
    xs0200: '商品处理异常',
    xs0201: '商品数据错误',
    xs0202: '商品数据不完整',
    xs0203: '商品主规格重复',
    xs0204: '商品规格组合重复',
    xs0205: '商品规格数据有误',
    xs0206: '商品规格所有库存为0',
    xs0207: '商品从数据错误',
    xs0208: '商品操作类型错误',
    xs0209: '商品禁止操作',
    xs0210: '商品获取异常',
    xs0211: '商品审核定时数据错误',
    xs0212: '商品草稿超限',
    xs0213: '商品库存刊登量不足',
    xs0231: '商品分组名称重复',
    xs0251: '商品定时规则数据错误',
    xs0252: '商品分类为空',
    xs0253: '卖家账号数量与商品数量不匹配错误',
    xs0254: '商品状态已变更，无法完成操作',
    xs0314: '主商品列表异常'
};
class ProductException extends BaseException {

    constructor(name, msg) {
        if (name && !msg) {
            msg = errorStatus[name];
        }
        super(name, msg);
    }

}

module.exports = ProductException
