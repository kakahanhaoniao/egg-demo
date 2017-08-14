'use strict';
const commonPublish = {
    // 基础六个状态验证
    // operateType验证
    operateTypeCheck: (rule, value) => {
        const enums = [ 'EndManual', 'CheckPublish', 'Delete', 'End', 'Relist', 'UpdateActive', 'UpdateActiveAddress', 'UpdateActivePrice', 'UpdateActivePublish', 'UpdateActiveShipping', 'UpdateActiveStock', 'UpdateEnd', 'UpdateEndPublish' ];
        if (!(!value || enums.indexOf(value) !== -1)) {
            return 'operateType错误！';
        }
    },
    // operateMode验证
    operateModeCheck: (rule, value) => {
        const enums = [ 'Update', 'Publish' ];
        if (!(!value || enums.indexOf(value) !== -1)) {
            return 'operateMode错误！';
        }
    },
    // operateStage验证
    operateStageCheck: (rule, value) => {
        const enums = [ 'UpdateBaseInfo', 'UpdateStockPrice' ];
        if (!(!value || enums.indexOf(value) !== -1)) {
            return 'operateStage错误！';
        }
    },
    // platform验证
    platformCheck: (rule, value) => {
        const enums = [ 'ebay', 'amazon', 'newegg', 'wish', 'cd' ];
        if (!(!value || enums.indexOf(value) !== -1)) {
            return 'platform错误！';
        }
    }
};

module.exports = commonPublish;
