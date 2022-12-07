"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryClient_1 = require("./query-core/QueryClient");
// 暴露的调用类
class LzyReactQuery {
    constructor(initQuery = {}) {
        this.queryStore = new QueryClient_1.QueryClient(initQuery);
    }
    useQuery(keys, queryFn, options) {
        if (!this.queryStore)
            return console.error('queryStore未初始化');
        return this.queryStore.useBaseQuery(keys, queryFn, options);
    }
    getQueryData(key) {
        if (!this.queryStore)
            return console.error('queryStore未初始化');
        return this.queryStore.getQueryData({ queryKey: [key] });
    }
    getAllQueryData() {
        if (!this.queryStore)
            return console.error('queryStore未初始化');
        return this.queryStore.getAllQueryData();
    }
}
exports.default = LzyReactQuery;
