'use strict';
module.exports = app => {
    // 开启 easy-monitor
    if (app.config.monitor.enable) {
        const easyMonitor = require('easy-monitor');
        easyMonitor(app.config.monitor.option);
    }
};
