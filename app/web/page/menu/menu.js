import App from 'app';
import { sync } from 'vuex-router-sync';
import router from 'component/menu/router';
import ElementUI from 'element-ui';
import store from 'store';
import Layout from 'component/layout/menu';
import Menu from './menu.vue';
App.use(ElementUI);
sync(store, router);
App.component(Layout.name, Layout);
export default App.init({
    base: '/menu',
    ...Menu,
    router,
    store
});
