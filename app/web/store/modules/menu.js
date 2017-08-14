import http from 'httpclient';
import { api } from './host';
const state = {
};

const actions = {
    async menuList({ commit, state }) {
        return await http.get(`${api}/menu/getMenu`);
    },
    async menuDetail({ commit, state }, id) {
        return await http.get(`${api}/menu/menuInfo/${id}`);
    },
    async saveMenu({ commit, state }, opt) {
        return await http.post(`${api}/menu/setMenu`, opt);
    },
    async editMenu({ commit, state }, opt) {
        return await http.post(`${api}/menu/editMenu`, opt);
    },
    async delMenu({ commit, state }, _id) {
        return await http.post(`${api}/menu/delMenu`, {
            _id
        });
    }
};

const mutations = {
    loading(state, loading) {
        state.loading = loading;
    }
};

const getters = {
    // menu() {
    //     return state.menuList;
    // },
    // detail() {
    //     return state.detail;
    // }
};
export default {
    actions,
    state,
    mutations,
    getters
};
