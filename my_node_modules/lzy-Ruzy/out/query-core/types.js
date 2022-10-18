"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultOptions = exports.getDefaultQueryState = void 0;
function getDefaultQueryState() {
    return {
        data: undefined,
        dataUpdateCount: 0,
        dataUpdatedAt: 0,
        error: null,
        fetchFailureCount: 0,
        errorUpdateCount: 0,
        status: 'loading',
        fetchStatus: 'idle' // 查询状态
    };
}
exports.getDefaultQueryState = getDefaultQueryState;
function getDefaultOptions() {
    return {
        queryKey: [],
        retry: 3,
        retryDelay: 100,
        staleTime: 5000,
        cacheTime: 3 * 60 * 1000,
        autoFetchInterval: false
    };
}
exports.getDefaultOptions = getDefaultOptions;
