import { QueryOptions, QueryKey, QueryFunction, FetchOptions, getDefaultOptions } from './types';
import { Query } from './Query'

// 延迟代码
export function sleep(delay: number = 0) {
    console.log('延迟' + delay);
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

// 浅比较两个对象是否相同
export function isShallowEqualObject<T>(a: T, b: T): boolean {
    if ((a && !b) || (b && !a)) {
        return false
    }

    for (const key in a) {
        if (a[key] !== b[key]) {
            return false
        }
    }

    return true
}

// 根据queryKey创建Query的hash值
export function createQueryHash(options: QueryOptions): number {
    const { queryKey } = options
    const queryStr = JSON.stringify(queryKey[0])
    return hashVal(queryStr)
}

function hashVal(string: string): number {
    var hash = 0, i: number, chr: number;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

// 检查是否能fetch (数据新鲜 且 status为error时不发请求)
export function shouldFetchByOptions(query: Query, options: QueryOptions): boolean {
    const shouldFetch =
        (!query.isStale(options.staleTime)) &&
        (query.state.status !== 'error')
    console.log('检查是否超过新鲜时间需要发起请求?', shouldFetch);
    return shouldFetch
}

// 合并options和查询键，查询函数  组成一个完整的QueryOptions
export function parseQueryArgs(keys: QueryKey, fn?: QueryFunction, options?: FetchOptions) {
    const defaultOptions = getDefaultOptions()
    return { ...defaultOptions, ...options, queryFn: fn, queryKey: keys }
}

// 删除对象中的空值
export function removeUndefinedFiled(obj: any) {
    if (typeof obj !== 'object') return console.error('target must be an object')
    Object.keys(obj).map((key: string) => {
        if (typeof obj[key] === 'undefined') { delete obj[key] }
    })
    return obj
}