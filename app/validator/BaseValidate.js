'use strict';
class BaseValidate {
    constructor(rules, validator) {
        this.validator = validator;
        this.init(rules);
    }
    // 初始化rules
    init(rules) {
        // 判断传入参数为数组对象并进行合并
        if (rules && rules instanceof Array && !rules.some(rule => !(rule instanceof Object))) {
            rules = Object.assign(...rules);
        }
        // 判断验证规则是对象且存在key值
        if (rules && rules instanceof Object && Object.keys(rules).length) {
            this.register(rules);
        }
    }
    // 设置规则
    setRule(name, rule) {
        this.validator.addRule(name, rule);
    }
    // 注册所有的rule到validator对象上
    register(rules) {
        for (const [ name, rule ] of Object.entries(rules)) {
            this.validator.addRule(name, rule);
        }
    }
}

module.exports = BaseValidate;
