'use strict';

// had enabled by egg
// exports.static = true;
exports.validate = {
    enable: true,
    package: 'egg-validate'
};
exports.getHttpClient = {
    enable: true,
    package: 'xbn-node-curl'
};

exports.authorize = {
    enable: true,
    package: 'xbn-node-auth'
};

exports.cache = {
    enable: true,
    package: 'xbn-node-cache'
};

// 开启mongodb
exports.mongoose = {
    enable: true,
    package: 'egg-mongoose'
};
// 开启vue模板渲染 ssr
exports.vue = {
    enable: true,
    package: 'egg-view-vue'
};

exports.vuessr = {
    enable: true,
    package: 'egg-view-vue-ssr'
};
