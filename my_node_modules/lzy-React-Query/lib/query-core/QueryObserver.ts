import type { QueryOptions, Action, QueryObserverResult } from './types'
import type { QueryClient } from './QueryClient'
import type { Query } from './Query'
import { isShallowEqualObject, shouldFetchByOptions } from './utils'
import { Subscribable } from './subscribable'

// QueryObserver观察者类 用于观察query对象的变化， 然后通知订阅它的react组件。
// react-query利用了React.useState初始会保存一个状态  做到组件更新也使用同一个observer实例。
// 每次组件重渲染 - 调用useQuery  调用observer.getOptimisticResult获取数据，


// 每个useQuery都对应一个observer
// 一旦QueryObserver数据发生变化，就会触发useQuery（通过useState）所在的组件的重新渲染，从而实现数据变化驱动UI变化。


// 组件 - 调用useQuery获取数据 - 创建observer,注册监听函数 - 
// 监听options变化  staleTime 
// 最后从Query获取数据  更新observer的Result
// 触发监听函数  组件重新render




export class QueryObserver extends Subscribable {
    options: QueryOptions
    private client: QueryClient
    private autoFetchInterval?: ReturnType<typeof setInterval>
    private currentQuery!: Query
    private currentResult!: QueryObserverResult
    private trackedProps!: Set<keyof QueryObserverResult>  // 追踪的result中的属性(用户访问一个属性就追踪一个  用来比较前后是否发生变化)

    constructor(client: QueryClient, options: QueryOptions) {
        super()
        console.log('创建observer');
        this.client = client // client中保存了cache
        this.options = options
        this.trackedProps = new Set() // 被用户使用的result中的属性  进行跟踪
        this.initObserver(options) // 初始化
    }

    remove() {  // 删除当前query
        this.client.getQueryCache().removeQuery(this.currentQuery)
    }

    fetch() { // 调用Query发起请求
        let promise = this.currentQuery.fetch(this.options)
        return promise
    }

    refetch() {   //todo 调用Query重新请求(先返回一个新result)
        let promise = this.currentQuery.refetch(this.options)
        return promise
    }

    checkAndFetch() { // 检查后再调用Query发起请求
        const shouldFetch = shouldFetchByOptions(this.currentQuery, this.options)
        if (!shouldFetch) return
        this.fetch()
    }

    initObserver(newOption: QueryOptions) {  // 根据options初始化observer(创建初始query 初始请求 创建初始result)
        this.updateOptions(newOption)  // 更新options
        this.updateCurrentQuery(newOption)// 更新query 
        this.checkAndFetch() // 初始请求
        this.updateResult() // 初始化result
        this.updateAutoFetchInterval() // 初始化轮询
    }

    handleOptionsChange(options: QueryOptions) {  //! 处理options发生变化的情况 
        const prevOptions = this.options
        const nextOptions = options

        this.updateOptions(nextOptions)

        // 切换query 重新初始化observer
        if (prevOptions.queryKey[0] !== nextOptions.queryKey[0]) {
            this.initObserver(nextOptions)
        }
        // 切换queryFn 
        else if (prevOptions.queryFn !== nextOptions.queryFn) {
            // this.currentQuery.refetch(nextOptions)
        }
        // 切换callBack 
        else if (prevOptions.onError !== nextOptions.onError) {
            // do nothing
        }
    }

    updateOptions(newOption: QueryOptions) {  //如果options发生更新  更新options
        if (newOption === this.options) return
        this.options = newOption
    }

    updateCurrentQuery(options: QueryOptions) {   // 创建/查询/更新currnetQuery ( 给query添加observer)
        const query = this.client.getQueryCache().getQuery(options)
        if (!query) { throw new Error('没有生成或初始化query,请检查store') }

        const prevQuery = this.currentQuery as Query | undefined
        const nextQuery = query
        if (prevQuery !== nextQuery) {
            nextQuery.addObserver(this)
            prevQuery?.removeObserver(this)
            this.currentQuery = nextQuery
        }

        return query
    }

    updateAutoFetchInterval() { // 更新自动重请求Interval
        const interval: number | false | undefined = this.options.autoFetchInterval
        if (!interval || interval <= 0) return
        clearInterval(this.autoFetchInterval)
        this.autoFetchInterval = setInterval(() => {
            this.fetch()
        }, interval)
    }

    updateResult() { // (根据追踪的props)更新result 获取前后两次的result
        const prevResult: QueryObserverResult | undefined = this.currentResult
        const nextResult = this.createResult(this.currentQuery, this.options)

        // 如果两个result完全是同一个对象则不更新(实际上会notify通知不更新)
        if (isShallowEqualObject(nextResult, prevResult)) return

        // 如果跟踪的result上的props变化了才更新
        let trackedPropChanged: boolean = false
        let mountResult: boolean = false
        if (typeof prevResult === 'undefined' && typeof nextResult !== 'undefined') {
            mountResult = true
        } else {
            trackedPropChanged = Object.keys(this.currentResult).some((key) => {
                const typedKey = key as keyof QueryObserverResult
                const changed = nextResult[typedKey] !== prevResult[typedKey]
                return changed && this.trackedProps.has(typedKey)
            })
            console.log('跟踪的props是否发生变化(是否可以重渲染组件??)', trackedPropChanged);
            console.log(prevResult, nextResult);

        }

        this.currentResult = nextResult

        if (mountResult || trackedPropChanged) {
            this.notifyListeners()
        }
    }

    createResult(query: Query, options: QueryOptions): QueryObserverResult {  // 处理参数  创建useQuery的返回结果

        // 上一次的query options result
        const prevQuery = this.currentQuery
        const prevOptions = this.options
        const prevResult = this.currentResult

        let { state } = query
        let { status, fetchStatus, error, data } = state

        // 如果没有结果 展示placeholderData
        if (typeof data === 'undefined' && status === 'loading') {
            data = prevResult?.data
        }

        // 返回的结果
        const result: QueryObserverResult = {
            data,
            status,
            fetchStatus,
            error,
            isStale: query.isStale.bind(query, this.options.staleTime), //! 注意 bind方法会改变函数引用(在判断result相等时需要处理)
            refetch: this.refetch.bind(this),
            remove: this.remove,
        }
        return result
    }

    getResult(options: QueryOptions): QueryObserverResult { // 创建一个result返回(如果发现Query更新了,重新initObserver)
        const query = this.client.getQueryCache().getQuery(options)
        return this.createResult(query, options)
    }

    onQueryUpdate(action: Action): void { // Query获取数据更新成功 调用此方法  更新Result
        console.log('Query获取数据更新成功  更新Result 执行回调');
        const { onSuccess, onFail, onError } = this.options
        switch (action.type) {
            case "success":
                if (onSuccess) { onSuccess(this.currentQuery.state.data) };
                break;
            case "failed":
                if (onFail) { onFail() };
                break;
            case "error":
                if (onError) { onError(this.currentQuery.state.error) };
                break;
            default:
                break;
        }

        this.updateResult()
    }

    trackResult(result: QueryObserverResult): QueryObserverResult {// 追踪result上的属性(用户是否访问)  去除isStale的追踪
        const trackedResult = {} as QueryObserverResult
        const unTrackProps = ['isStale', 'refetch']
        Object.keys(result).forEach((key) => {
            Object.defineProperty(trackedResult, key, {
                configurable: false,
                enumerable: true,
                get: () => {
                    if (unTrackProps.indexOf(key) === -1) {
                        this.trackedProps.add(key as keyof QueryObserverResult)
                    }
                    return result[key as keyof QueryObserverResult]
                },
            })
        })

        return trackedResult
    }

    // 给listeners发送通知 进行更新 (这里的Listener就是React的setState  调用执行组件render)
    notifyListeners() {
        this.listeners.forEach((listener) => {
            listener(this.currentResult)
        })
    }

    // 给Querys发送通知 进行更新(暂时不用)
    notifyQuerys() {

    }
}