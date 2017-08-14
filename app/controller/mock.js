'use strict';
module.exports = app => {
    class MockController extends app.Controller {
        show() {
            this.ctx.success(this.ctx.swaggerSpec);
        }
  }
    return MockController;
};
