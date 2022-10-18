import type { QueryClient } from './QueryClient';
import { QueryState, QueryOptions } from './types'
import { Subscribable } from './subscribable'
import { createQueryHash } from './utils'
import { Query } from './Query'
//! QueryCache挂载在QueryClient上   这里储存了多个query数据结构  用于管理多个Query
export class QueryCache extends Subscribable {
    private config: {}
    private queries: Set<Query>
    private queriesMap: Record<number, Query>
    private queryClient: QueryClient

    constructor(client: QueryClient, config?: any) {
        super()
        this.config = config || {}
        this.queries = new Set()
        this.queriesMap = {}
        this.queryClient = client
    }

    getQuery(options: QueryOptions): Query {  // 通过options获取query
        let query = this.findQuery(options)
        return query
    }

    getQueries() { // 获取全部Query对象
        return this.queriesMap
    }

    createQuery(options: QueryOptions, state?: QueryState) {  // 新建一个query
        const queryHash = createQueryHash(options)
        const newQuery = new Query({
            cache: this,
            queryKey: options.queryKey,
            queryHash,
            options,
            state
        })
        this.addQuery(newQuery)

        return newQuery
    }

    addQuery(query: Query) {   // 添加一个query到cache中  (map键值对用于去重)
        const hash = query.queryHash
        if (!this.queriesMap[hash]) {
            this.queriesMap[hash] = query
            this.queries.add(query)
        }
    }

    removeQuery(query: Query) {  // 删除Query
        const hash = query.queryHash
        if (this.queriesMap[hash] === query) {
            delete this.queriesMap[hash]
            this.queries.delete(query)
        }

        console.log('删除Query', this.queries);

    }

    findQuery(options: QueryOptions) {  // 通过查询键hash 找到query并返回
        const queryHash = createQueryHash(options)
        return this.queriesMap[queryHash]
    }

}

