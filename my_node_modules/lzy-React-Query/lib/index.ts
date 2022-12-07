import type { QueryFunction, QueryKey, FetchOptions, InitQuery } from './query-core/types'
import { QueryClient } from './query-core/QueryClient'


// 暴露的调用类
export default class LzyReactQuery {
    private queryStore: QueryClient | undefined

    constructor(initQuery: InitQuery={}) {
        this.queryStore = new QueryClient(initQuery)
    }

    useQuery(
        keys: QueryKey,
        queryFn: QueryFunction,
        options?: FetchOptions
    ) {
        if (!this.queryStore) return console.error('queryStore未初始化')
        return this.queryStore.useBaseQuery(keys, queryFn, options)
    }

    getQueryData(key: string) {
        if (!this.queryStore) return console.error('queryStore未初始化')
        return this.queryStore.getQueryData({ queryKey: [key] })
    }

    getAllQueryData() {
        if (!this.queryStore) return console.error('queryStore未初始化')
        return this.queryStore.getAllQueryData()
    }
}



