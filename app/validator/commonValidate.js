'use strict';
const commonValidate = {
    // posInt 正整数
    posInt: (rule, value) => {
        if (!value.match(/^[1-9]\d*$/)) {
            return '必须是正整数';
        }
    },
    // int 整数
    int: (rule, value) => {
        if (!value.match(/^(-?)[1-9]\d*$/)) {
            return '必须是整数';
        }
    },
    // geqZero 非负整数 >=0
    geqZero: (rule, value) => {
        if (!value.match(/^([1-9]\d*|0)$/)) {
            return '必须是大于等于0的整数';
        }
    },
    // gt0PosFloat 正浮点数(小数点后两位) 大于0
    gt0PosFloat: (rule, value) => {
        if (!value.match(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/)) {
            return '必须是大于0的小数点保留两位的数值';
        }
    },
    // posFloat 正浮点数(小数点后两位) 大于或等于0
    posFloat: (rule, value) => {
        if (!value.match(/^(([1-9]\d*|0)(\.\d{1,2})?)$/)) {
            return '必须是大于等于0的小数点保留两位的数值';
        }
    },

    // english 英文字母
    english: (rule, value) => {
        if (!value.match(/^[A-Za-z]+$/)) {
            return '必须是英文字母';
        }
    },

    // englishOrNumber 英文字母+数字组合
    englishOrNumber: (rule, value) => {
        if (!value.match(/^[A-Za-z0-9]+$/)) {
            return '必须是英文字母或者数字';
        }
    },

    // common 匹配中文、英文、数字及下划线
    common: (rule, value) => {
        if (!value.match(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/)) {
            return '只能是中文、英文、数字及下划线组合的字符串';
        }
    },

    // uri 匹配域名链接
    uri: (rule, value) => {
        if (!value.match(/^(https?|s?ftp):\/\/[\w\.]+(?=hanhaoniao\.cc\/?).*/)) {
            return '只能当前域名下的链接';
        }
    },

    // chinese 匹配中文
    chinese: (rule, value) => {
        if (!value.match(/^[\u4e00-\u9fa5]+$/)) {
            return '只能输入中文';
        }
    },

    // dbChar 匹配双字节字符(包括汉字在内)：评注：可以用来计算字符串的长度（一个双字节字符长度计2，ASCII字符计1）
    dbChar: (rule, value) => {
        if (!value.match(/^[^\x00-\xff]+$/)) {
            return '只能输入双字节字符';
        }
    },

    // zipCode 匹配中国邮政编码 邮编
    zipCode: (rule, value) => {
        if (!value.match(/^[1-9]\d{5}(?!\d)$/)) {
            return '只能输入邮政编码';
        }
    },

    // ipCard 匹配身份证
    ipCard: (rule, value) => {
        if (!value.match(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/)) {
            return '只能输入身份证号';
        }
    },

    // ip 匹配IP地址

    ip: (rule, value) => {
        if (!value.match(/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/)) {
            return '只能输入ip地址';
        }
    },

    // html 匹配html
    html: (rule, value) => {
        if (!value.match(/^<(.*)>.*<\/\1>|<(.*) \/>$/)) {
            return '只能输入html';
        }
    }, // 待验证 /<([^<>]+)>/

    // sql sql语句匹配
    sql: (rule, value) => {
        if (!value.match(/^(select|drop|delete|create|update|insert).*$/)) {
            return '只能输入sql语句';
        }
    },

    // img 提取信息中的图片链接
    img: (rule, value) => {
        if (!value.match(/^(s|S)(r|R)(c|C) *= *('|")?(\w|\\|\/|\.)+('|"| *|>)?$/)) {
            return '只能输入图片路径';
        }
    },

    json: (rule, value) => {
        try {
            JSON.parse(value);
        } catch (err) {
            return '必须是JSON字符串';
        }
    }
};

module.exports = commonValidate;
