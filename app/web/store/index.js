import Vue from 'vue';
import Vuex from 'vuex';
import menu from './modules/menu';
import gloable from './modules/gloable';
Vue.use(Vuex);
export default new Vuex.Store({
    namespaced: true,
    modules: {
        menu,
        gloable: {
            namespaced: true,
            modules: {
                gloable
            }
        }
    }
});
