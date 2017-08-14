import Vue from 'vue';

import VueRouter from 'vue-router';

import ListView from './list';
import DetailView from './detail';
Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'history',
    base: '/menu',
    routes: [
        {
            path: '/',
            component: ListView
        },
        {
            path: '/menuList',
            component: ListView
        },
        {
            path: '/detail/:id',
            component: DetailView
        },
        {
            path: '/detail',
            component: DetailView
        }
    ]
});

export default router;
