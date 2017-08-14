'use strict';
/**
 * 把返回的数据集转换成Tree
 * @method listToTree
 * @param {array} list 要转换的数据集
 * @param {string} pk 子集标记id
 * @param {string} pid parent标记字段
 * @param {string|array} child 子集生成对象name
 * @param {string} root 顶级节点的id
 * @param {array} filter 要过滤的key值
 * @param {boolean} isMenu 是否为菜单(默认为false)
 * @param {string} menuBtnChild 菜单按钮标记字段
 * @return {object} array
 * @example
 listToTree(data.data, 'categoryId', 'parentCategoryId', 'children', '0000');
 */
function listToTree(list, pk = 'id', pid = 'pid', child = '_child', root = '0000', filter = [], isMenu = false, menuBtnChild = '') {
    // 创建Tree
    const tree = {};
    const primaryChild = child;
    if (list instanceof Array) {
        // 创建基于主键的数组引用
        const refer = {};
        list.forEach(data => {
            refer[data[pk]] = data;
        });
        list.forEach(data => {
            // 判断是否存在parent
            const parentId = data[pid];
            if (root === parentId) {
                tree[data[pk]] = data;
            } else {
                if (isMenu) {
                    child = treeForMenu(data, primaryChild, menuBtnChild);
                }
                if (typeof refer[parentId] !== 'undefined') {
                    const parent = refer[parentId];
                    if (typeof parent[child] === 'undefined') {
                        parent[child] = {};
                    }
                    parent[child][data[pk]] = data;
                }
            }
            if (filter.length) {
                Object.keys(data).forEach(v => {
                    if (filter.indexOf(v) === -1) {
                        delete data[v];
                    }
                });
            }
        });
    }
    return tree;
}

/** 为路由菜单专门定制
* @param {object} data 菜单数据
* @param {string} childFieldName 子集菜单字段名称（初始值）
* @param {string} menuBtnChild 子集按钮字段名称
* @return {string} 子集字段名称
*/
function treeForMenu(data, childFieldName, menuBtnChild) {
    if (Object.keys(data).indexOf('is_always_show') === -1) {
        return menuBtnChild;
    }
    return childFieldName;
}

module.exports = {
    listToTree
};
