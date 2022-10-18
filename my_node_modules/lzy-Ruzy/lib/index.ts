import type { QueryFunction, QueryKey, FetchOptions, InitQuery } from './query-core/types'
import type { InitState, SetStateParam } from './store-core/type'
import { QueryClient } from './query-core/QueryClient'
import { StateCache } from './store-core/StateCache'


export default class Ruzy {
    private store: StateCache | undefined //Rekv这里需要重命名
    private queryStore: QueryClient | undefined

    constructor() {
        this.store = undefined
        this.queryStore = undefined
    }

    initStates(initState: InitState) {
        this.store = new StateCache(initState)
        return this.store.getAllState()
    }

    initQueries(initQuery: InitQuery) {
        this.queryStore = new QueryClient(initQuery)
        return this.queryStore.getAllQueryData()
    }

    useState(...key: string[]) {
        if (!this.store) return console.error('store未初始化')
        return this.store?.useBaseState(...key)
    }

    setState(param: SetStateParam) {
        if (!this.store) return console.error('store未初始化')
        return this.store?.setBaseState(param)
    }

    getState(key: string) {
        if (!this.store) return console.error('store未初始化')
        return this.store?.getState(key)
    }

    getAllState() {
        if (!this.store) return console.error('store未初始化')
        return this.store?.getAllState()
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



