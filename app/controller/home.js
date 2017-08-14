'use strict';

module.exports = app => {
    class HomeController extends app.Controller {
        index() {
            // const debug = this.ctx.helper.createDebug('HomeController.a');
            // const debug2 = this.ctx.helper.createDebug('HomeController.b');
            // debug('licenses');
            this.ctx.success('hi, world');
        }
        // vue ssr test
        * about() {
            debugger;
            yield this.ctx.render('about/about.js', { message: 'vue server side render!' });
        }

  }
    return HomeController;
};
