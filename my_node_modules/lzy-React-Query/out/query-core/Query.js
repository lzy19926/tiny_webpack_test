"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const types_1 = require("./types");
const retryer_1 = require("./retryer");
const utils_1 = require("./utils");
// Query是react-query底层核心类，它负责网络数据请求、状态变化的处理、以及内存回收工作。
//Query给Retryer指定fn（请求函数主体）、retry（重试次数）、retryDelay（重试延迟时间），以及一系列状态变化回调函数（比如onSuccess、onPause等）。
// Query一旦开启  会持续调用其中的retryer进行请求
//! Query有四种状态，网络请求的过程中，Query的状态会发生变化。
//Query使用经典的reducer模式处理状态变化。reducer模式  (也就是Dispatch、Action、和Reducer三个组成部分)
class Query {
    constructor(config) {
        this.options = config.options;
        this.observers = [];
        this.cache = config.cache;
        this.queryKey = config.queryKey;
        this.queryHash = config.queryHash;
        this.state = config.state || (0, types_1.getDefaultQueryState)();
        console.log('创建Query', config.queryKey, config.queryHash);
        this.updateGCTimer();
    }
    // 更新上一次的options
    updateOptions(options) {
        const removeUndefinedOptions = (0, utils_1.removeUndefinedFiled)(options);
        this.options = Object.assign(Object.assign({}, this.options), removeUndefinedOptions);
    }
    // 更新垃圾回收器 (缓存时间到后删除Query)
    updateGCTimer() {
        const cacheTime = this.options.cacheTime;
        if (!cacheTime)
            return;
        if (this.GCtimer) {
            clearTimeout(this.GCtimer);
        }
        this.GCtimer = setTimeout(() => {
            console.log('垃圾回收');
            // this.destory()
            this.cache.removeQuery(this);
            clearTimeout(this.GCtimer);
        }, cacheTime);
    }
    // Query是否正在被使用
    isActive() {
        return this.observers.some((observer) => observer.options.enable !== false);
    }
    // 数据是否新鲜(byTime)?
    isStale(staleTime = 3000) {
        const updateAt = this.state.dataUpdatedAt;
        if (!updateAt)
            return false;
        if ((Date.now() - updateAt) < staleTime)
            return true;
        return false;
    }
    // 添加一个ob
    addObserver(observer) {
        if (this.observers.indexOf(observer) === -1) {
            this.observers.push(observer);
        }
    }
    // 删除一个ob
    removeObserver(observer) {
        if (this.observers.indexOf(observer) !== -1) {
            this.observers = this.observers.filter((x) => x !== observer);
        }
        if (!this.observers.length) { //没有ob时 终止请求,重启垃圾回收
            this.stopFetch();
            this.updateGCTimer();
        }
    }
    // Query自我销毁(无observer时销毁)
    destory() {
        const canDestory = (!this.observers.length) && (this.state.fetchStatus === 'idle');
        if (canDestory) {
            this.cache.removeQuery(this);
        }
    }
    // 创建retryer  发起请求
    fetch(options) {
        // 更新options
        if (options) {
            this.updateOptions(options);
        }
        //todo 如果没指定fn  执行上一次的fn(options中保存)
        if (!this.options.queryFn) {
            const error = new Error('Missing queryFn');
            this.dispatch({ type: 'error', error });
            return error;
        }
        // queryKey需要数组
        if (!Array.isArray(this.options.queryKey)) {
            const error = new Error('queryKey需要是一个数组');
            this.dispatch({ type: 'error', error });
            return error;
        }
        //todo 创建一个fetchFn
        const fetchFn = this.options.queryFn;
        // 定义retryer的回调  (dispatch一个Action 用来修改Query的状态)
        const onError = (error) => {
            this.dispatch({ type: 'error', error });
        };
        const onSuccess = (data) => {
            if (typeof data === 'undefined')
                return onError(new Error('Query data cannot be undefined'));
            this.dispatch({ type: 'success', data });
        };
        const onFail = () => {
            this.dispatch({ type: 'failed' });
        };
        const onPause = () => {
            this.dispatch({ type: 'pause' });
        };
        const onContinue = () => {
            this.dispatch({ type: 'continue' });
        };
        //  如果空闲就发起一次请求
        if (this.state.fetchStatus === 'idle') {
            this.dispatch({ type: 'fetch' });
        }
        this.retryer = (0, retryer_1.createRetryer)({
            fn: fetchFn,
            // abort: false, // 终止指针
            onSuccess,
            onError,
            onFail,
            onPause,
            onContinue,
            retry: options.retry,
            retryDelay: options.retryDelay, // 延迟时间
        });
        // 将retryer返回的结果保存 并返回
        this.promise = this.retryer.promise;
        return this.promise;
    }
    // 停止retryer请求
    stopFetch() {
        var _a;
        (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.cancleRetry();
    }
    // 重新请求
    refetch(options) {
        this.stopFetch();
        return this.fetch(options);
    }
    // 根据action创建创建不同的reducer 来修改当前query的状态
    dispatch(action) {
        const reducer = (state) => {
            var _a;
            switch (action.type) {
                case 'fetch':
                    return Object.assign(Object.assign({}, state), { fetchFailureCount: 0, fetchStatus: 'fetching', status: 'loading' });
                case 'success':
                    return Object.assign(Object.assign({}, state), { data: action.data, dataUpdateCount: state.dataUpdateCount + 1, dataUpdatedAt: (_a = action.dataUpdatedAt) !== null && _a !== void 0 ? _a : Date.now(), error: null, status: 'success', fetchStatus: 'idle' });
                case 'failed':
                    return Object.assign(Object.assign({}, state), { fetchFailureCount: state.fetchFailureCount + 1 });
                case 'error':
                    return Object.assign(Object.assign({}, state), { error: action.error, errorUpdateCount: state.errorUpdateCount + 1, fetchFailureCount: state.fetchFailureCount + 1, status: 'error', fetchStatus: 'idle' });
                case 'pause':
                    return Object.assign(Object.assign({}, state), { fetchStatus: 'paused' });
                case 'continue':
                    return Object.assign(Object.assign({}, state), { fetchStatus: 'fetching' });
            }
        };
        this.state = reducer(this.state); //修改query的state
        console.log('dispatch成功  更改state, Action:', action);
        // 通知所有的observer  state更新了  observer重新渲染组件
        this.observers.forEach((observer) => {
            observer.onQueryUpdate(action);
        });
    }
}
exports.Query = Query;
