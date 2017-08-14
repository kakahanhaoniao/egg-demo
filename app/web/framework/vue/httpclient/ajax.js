import axios from 'axios';
import store from 'store';
axios.interceptors.request.use(request => {
    store.dispatch('gloable/loading', true);
    return request;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    store.dispatch('gloable/loading', false);
    return response.data;
}, error => Promise.resolve(error.response));

export default {
    post(url, data) {
        return axios({
            method: 'post',
            url,
            data,
            timeout: 3000
        });
    },
    get(url, params) {
        return axios({
            method: 'get',
            url,
            params,
            timeout: 3000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
    }
};
