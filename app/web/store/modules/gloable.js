import { Message } from 'element-ui';
const state = {
    loading: false,
    progress: 0
};

const actions = {
    loading({ commit, state }, isShowloading) {
        commit('loading', isShowloading);
    },
    showMsg({ commit, state, rootState }, { msg, type }) {
        Message({
            showClose: true,
            message: msg,
            type: type ? type : 'error',
            duration: 3000
        });
    }
};

const mutations = {
    loading(state, loading) {
        state.loading = loading;
    }
};

const getters = {
    gloable(state) {
        return state;
    }
};
export default {
    actions,
    state,
    mutations,
    getters
};
