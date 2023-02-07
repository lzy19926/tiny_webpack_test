import { QueryOptions, QueryState, getDefaultQueryState, InitQuery } from './types'
import { QueryFunction, QueryKey, FetchOptions, QueryObserverResult } from './types'
import { QueryObserver } from './QueryObserver'
import { QueryCache } from './QueryCache'
import { parseQueryArgs } from './utils'
import * as LzyReact from '../../../../lzy-React/out/index_V3'



//! client用来提供用户操作的方法   
export class QueryClient {
    private queryCache: QueryCache
    constructor(initQuery: InitQuery) {
        this.queryCache = new QueryCache(this)
        this.initQueries(initQuery)
    }

    initQueries(initQuery: InitQuery) {
        Object.keys(initQuery).map((key: string) => {
            const { fn, initData } = initQuery[key]
            const initState: QueryState = getDefaultQueryState()

            initState.data = initData
            this.queryCache.createQuery(
                {
                    queryKey: [key],  //查询key
                    queryFn: fn, //请求函数
                }
                , initState)
        })

        return this.getAllQueryData()
    }

    getQueryCache() {
        return this.queryCache
    }

    getQueryData(options: QueryOptions) {
        return this.queryCache.findQuery(options)?.state.data
    }

    getAllQueryData() {
        const querys = this.queryCache.getQueries()
        const res = {}
        for (let hash in querys) {
            const { queryKey, state } = querys[hash]
            const key = queryKey[0]
            const data = state?.data
            const url = state?.data?.request?.responseURL
            Object.assign(res, { [key]: { data, url } })
        }
        return res
    }

    useBaseQuery(
        keys: QueryKey,
        queryFn: QueryFunction,
        options?: FetchOptions,
    ): QueryObserverResult {

        // 返回格式化后的options
        const parsedOptions = parseQueryArgs(keys, queryFn, options)

        //构建一个新的Observer  
        const [observer, _] = LzyReact.myUseState(() => new QueryObserver(this, parsedOptions))

        //监视options变更
        LzyReact.myUseEffect(() => {
            observer.handleOptionsChange(parsedOptions)
        }, [parsedOptions])

        console.log(observer);


        // 创建reRender触发器(updater)  推入listener中 Observer通知组件更新时会触发所有的updater
        const reRenderer = LzyReact.myUseState(undefined)[1]
        observer.subscribe(reRenderer)

        let result = observer.getResult(parsedOptions)

        // 如果是重复调用钩子  则发起请求
        if (result.status !== 'loading' && result.fetchStatus === 'idle') {
            observer.checkAndFetch()
        }

        return observer.trackResult(result)
    }

    //todo 未完成  主动请求
    fetchQuery(queryOptions: QueryOptions) {
        // 给与retry默认值
        if (typeof queryOptions?.retry === 'undefined') {
            queryOptions.retry = false
        }
        // 新建/找到一个query缓存对象
        const query = this.queryCache.getQuery(queryOptions)

        // 检查数据是否新鲜(新鲜则直接返回数据)
        const isStale = query.isStale(queryOptions.staleTime)

        return isStale
            ? Promise.resolve(query.state.data)
            : query.fetch(queryOptions) //!  延时请求  实际上调用的是query.fetch方法
    }
    //todo 未完成  预请求
    preFetchQuery() { }
}