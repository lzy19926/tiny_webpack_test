"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryClient = void 0;
const types_1 = require("./types");
const QueryObserver_1 = require("./QueryObserver");
const QueryCache_1 = require("./QueryCache");
const utils_1 = require("./utils");
const LzyReact = __importStar(require("../../../lzy-React/out/index_V3"));
//! client用来提供用户操作的方法   
class QueryClient {
    constructor(initQuery) {
        this.queryCache = new QueryCache_1.QueryCache(this);
        this.initQueries(initQuery);
    }
    initQueries(initQuery) {
        Object.keys(initQuery).map((key) => {
            const { fn, initData } = initQuery[key];
            const initState = (0, types_1.getDefaultQueryState)();
            initState.data = initData;
            this.queryCache.createQuery({
                queryKey: [key],
                queryFn: fn, //请求函数
            }, initState);
        });
        return this.getAllQueryData();
    }
    getQueryCache() {
        return this.queryCache;
    }
    getQueryData(options) {
        var _a;
        return (_a = this.queryCache.findQuery(options)) === null || _a === void 0 ? void 0 : _a.state.data;
    }
    getAllQueryData() {
        var _a, _b;
        const querys = this.queryCache.getQueries();
        const res = {};
        for (let hash in querys) {
            const { queryKey, state } = querys[hash];
            const key = queryKey[0];
            const data = state === null || state === void 0 ? void 0 : state.data;
            const url = (_b = (_a = state === null || state === void 0 ? void 0 : state.data) === null || _a === void 0 ? void 0 : _a.request) === null || _b === void 0 ? void 0 : _b.responseURL;
            Object.assign(res, { [key]: { data, url } });
        }
        return res;
    }
    useBaseQuery(keys, queryFn, options) {
        // 返回格式化后的options
        const parsedOptions = (0, utils_1.parseQueryArgs)(keys, queryFn, options);
        //构建一个新的Observer  
        const [observer, _] = LzyReact.myUseState(() => new QueryObserver_1.QueryObserver(this, parsedOptions));
        //监视options变更
        LzyReact.myUseEffect(() => {
            observer.handleOptionsChange(parsedOptions);
        }, [parsedOptions]);
        console.log(observer);
        // 创建reRender触发器(updater)  推入listener中 Observer通知组件更新时会触发所有的updater
        const reRenderer = LzyReact.myUseState(undefined)[1];
        observer.subscribe(reRenderer);
        let result = observer.getResult(parsedOptions);
        // 如果是重复调用钩子  则发起请求
        if (result.status !== 'loading' && result.fetchStatus === 'idle') {
            observer.checkAndFetch();
        }
        return observer.trackResult(result);
    }
    //todo 未完成  主动请求
    fetchQuery(queryOptions) {
        // 给与retry默认值
        if (typeof (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.retry) === 'undefined') {
            queryOptions.retry = false;
        }
        // 新建/找到一个query缓存对象
        const query = this.queryCache.getQuery(queryOptions);
        // 检查数据是否新鲜(新鲜则直接返回数据)
        const isStale = query.isStale(queryOptions.staleTime);
        return isStale
            ? Promise.resolve(query.state.data)
            : query.fetch(queryOptions); //!  延时请求  实际上调用的是query.fetch方法
    }
    //todo 未完成  预请求
    preFetchQuery() { }
}
exports.QueryClient = QueryClient;
