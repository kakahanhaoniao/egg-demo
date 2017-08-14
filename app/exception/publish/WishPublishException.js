'use strict';
const BasePublishException = require('./BasePublishException');
const errorStatus = {
    2020346: 'WISH下线商品列表异常',
    2020347: 'WISH在线商品列表异常',
    2020348: 'WISH刊登审核商品列表',
    2020349: 'WISH编辑审核商品列表异常',
    2020350: 'WISH下线商品详情异常',
    2020351: 'WISH在线商品详情异常',
    2020352: 'WISH刊登审核商品详情异常',
    2020353: 'WISH编辑审核商品详情异常'
};
class WishPublishException extends BasePublishException {

    constructor(name, msg) {
        if (name && !msg) {
            msg = errorStatus[name];
        }
        super(name, msg);
    }

}

module.exports = WishPublishException;
