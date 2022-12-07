"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefinedFiled = exports.parseQueryArgs = exports.shouldFetchByOptions = exports.createQueryHash = exports.isShallowEqualObject = exports.sleep = void 0;
const types_1 = require("./types");
// 延迟代码
function sleep(delay = 0) {
    console.log('延迟' + delay);
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
exports.sleep = sleep;
// 浅比较两个对象是否相同
function isShallowEqualObject(a, b) {
    if ((a && !b) || (b && !a)) {
        return false;
    }
    for (const key in a) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
exports.isShallowEqualObject = isShallowEqualObject;
// 根据queryKey创建Query的hash值
function createQueryHash(options) {
    const { queryKey } = options;
    const queryStr = JSON.stringify(queryKey[0]);
    return hashVal(queryStr);
}
exports.createQueryHash = createQueryHash;
function hashVal(string) {
    var hash = 0, i, chr;
    if (string.length === 0)
        return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}
// 检查是否能fetch (数据新鲜 且 status为error时不发请求)
function shouldFetchByOptions(query, options) {
    const shouldFetch = (!query.isStale(options.staleTime)) &&
        (query.state.status !== 'error');
    console.log('检查是否超过新鲜时间需要发起请求?', shouldFetch);
    return shouldFetch;
}
exports.shouldFetchByOptions = shouldFetchByOptions;
// 合并options和查询键，查询函数  组成一个完整的QueryOptions
function parseQueryArgs(keys, fn, options) {
    const defaultOptions = (0, types_1.getDefaultOptions)();
    return Object.assign(Object.assign(Object.assign({}, defaultOptions), options), { queryFn: fn, queryKey: keys });
}
exports.parseQueryArgs = parseQueryArgs;
// 删除对象中的空值
function removeUndefinedFiled(obj) {
    if (typeof obj !== 'object')
        return console.error('target must be an object');
    Object.keys(obj).map((key) => {
        if (typeof obj[key] === 'undefined') {
            delete obj[key];
        }
    });
    return obj;
}
exports.removeUndefinedFiled = removeUndefinedFiled;
