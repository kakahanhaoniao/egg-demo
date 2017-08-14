'use strict';
const BaseException = require('./BaseException');
const commonError = {
    xs0101: '上传图片发生异常',
    xs0102: '上传图片超出最大限制异常',
    xs0103: '图片类型异常',
    xs0201: '上传发生异常',
    xs0202: '上传文件超出最大限制异常',
    xs0203: '文件类型异常',
    xs0204: '文件ID 不合法',
    xs0205: '网络上传URL不合法',
    xs0206: '参数不能为空',
    xs0207: '默认相册不能删除',
    xs0208: '相册ID 不合法',
    xs0209: '图片存在关联，无法删除',
    xs0210: '传的本地文件重复，图库已存在!',
    xs0211: '您选择的图片中有不符合尺寸要求的图片',
    xs0212: '图片名称重复'
};
class ImageException extends BaseException {

    constructor(name, msg) {
        if (name && !msg) {
            msg = commonError[name];
        }
        super(name, msg);
    }

}

module.exports = ImageException;
