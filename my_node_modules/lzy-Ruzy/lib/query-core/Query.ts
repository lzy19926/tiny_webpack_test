import { QueryCache } from './QueryCache'
import { QueryObserver } from './QueryObserver'
import { QueryKey, QueryOptions, QueryState, Action, Retryer, QueryConfig } from './types'
import { getDefaultQueryState } from './types'
import { createRetryer } from './retryer'
import { removeUndefinedFiled } from './utils'

// Query是react-query底层核心类，它负责网络数据请求、状态变化的处理、以及内存回收工作。
//Query给Retryer指定fn（请求函数主体）、retry（重试次数）、retryDelay（重试延迟时间），以及一系列状态变化回调函数（比如onSuccess、onPause等）。
// Query一旦开启  会持续调用其中的retryer进行请求

//! Query有四种状态，网络请求的过程中，Query的状态会发生变化。

//Query使用经典的reducer模式处理状态变化。reducer模式  (也就是Dispatch、Action、和Reducer三个组成部分)

export class Query {
    queryKey: QueryKey
    queryHash: number
    options: QueryOptions
    state: QueryState
    private cache: QueryCache
    private retryer?: Retryer
    observers: QueryObserver[]
    private promise?: Promise<any> // 保存的结果(从retryer中获取)
    private GCtimer?: ReturnType<typeof setTimeout>// 垃圾回收timer

    constructor(config: QueryConfig) {
        this.options = config.options
        this.observers = []
        this.cache = config.cache
        this.queryKey = config.queryKey
        this.queryHash = config.queryHash
        this.state = config.state || getDefaultQueryState()
        console.log('创建Query', config.queryKey, config.queryHash);
        this.updateGCTimer()
    }

    // 更新上一次的options
    updateOptions(options: QueryOptions) {
        const removeUndefinedOptions = removeUndefinedFiled(options)
        this.options = { ...this.options, ...removeUndefinedOptions }
    }
    // 更新垃圾回收器 (缓存时间到后删除Query)
    updateGCTimer() {
        const cacheTime = this.options.cacheTime
        if (!cacheTime) return

        if (this.GCtimer) {
            clearTimeout(this.GCtimer)
        }

        this.GCtimer = setTimeout(() => {
            console.log('垃圾回收');
            // this.destory()
            this.cache.removeQuery(this)
            clearTimeout(this.GCtimer)
        }, cacheTime)
    }
    // Query是否正在被使用
    isActive(): boolean {
        return this.observers.some((observer) => observer.options.enable !== false)
    }
    // 数据是否新鲜(byTime)?
    isStale(staleTime: number = 3000): boolean {
        const updateAt = this.state.dataUpdatedAt
        if (!updateAt) return false
        if ((Date.now() - updateAt) < staleTime) return true
        return false
    }
    // 添加一个ob
    addObserver(observer: QueryObserver): void {
        if (this.observers.indexOf(observer) === -1) {
            this.observers.push(observer)
        }
    }
    // 删除一个ob
    removeObserver(observer: QueryObserver) {
        if (this.observers.indexOf(observer) !== -1) {
            this.observers = this.observers.filter((x) => x !== observer)
        }
        if (!this.observers.length) {//没有ob时 终止请求,重启垃圾回收
            this.stopFetch()
            this.updateGCTimer()
        }
    }
    // Query自我销毁(无observer时销毁)
    destory() {
        const canDestory = (!this.observers.length) && (this.state.fetchStatus === 'idle')
        if (canDestory) {
            this.cache.removeQuery(this)
        }
    }
    // 创建retryer  发起请求
    fetch(options: QueryOptions): Promise<any> | Error {
        // 更新options
        if (options) {
            this.updateOptions(options)
        }
        //todo 如果没指定fn  执行上一次的fn(options中保存)
        if (!this.options.queryFn) {
            const error = new Error('Missing queryFn')
            this.dispatch({ type: 'error', error })
            return error
        }
        // queryKey需要数组
        if (!Array.isArray(this.options.queryKey)) {
            const error = new Error('queryKey需要是一个数组')
            this.dispatch({ type: 'error', error })
            return error
        }
        //todo 创建一个fetchFn
        const fetchFn = this.options.queryFn

        // 定义retryer的回调  (dispatch一个Action 用来修改Query的状态)
        const onError = (error: Error) => {
            this.dispatch({ type: 'error', error })
        }
        const onSuccess = (data: any) => {
            if (typeof data === 'undefined') return onError(new Error('Query data cannot be undefined'))
            this.dispatch({ type: 'success', data })
        }
        const onFail = () => {
            this.dispatch({ type: 'failed' })
        }
        const onPause = () => {
            this.dispatch({ type: 'pause' })
        }
        const onContinue = () => {
            this.dispatch({ type: 'continue' })
        }


        //  如果空闲就发起一次请求
        if (this.state.fetchStatus === 'idle') {
            this.dispatch({ type: 'fetch' })
        }
        this.retryer = createRetryer({
            fn: fetchFn,
            // abort: false, // 终止指针
            onSuccess,
            onError,
            onFail,
            onPause,
            onContinue,
            retry: options.retry, // 重复次数
            retryDelay: options.retryDelay,// 延迟时间
        })

        // 将retryer返回的结果保存 并返回
        this.promise = this.retryer.promise

        return this.promise
    }
    // 停止retryer请求
    stopFetch() {
        this.retryer?.cancleRetry()
    }
    // 重新请求
    refetch(options: QueryOptions) {
        this.stopFetch()
        return this.fetch(options)
    }
    // 根据action创建创建不同的reducer 来修改当前query的状态
    private dispatch(action: Action): void {
        const reducer = (state: QueryState): QueryState => {
            switch (action.type) {
                case 'fetch':
                    return {
                        ...state,
                        fetchFailureCount: 0,
                        fetchStatus: 'fetching',
                        status: 'loading'
                    }
                case 'success':
                    return {
                        ...state,
                        data: action.data,
                        dataUpdateCount: state.dataUpdateCount + 1,
                        dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
                        error: null,
                        status: 'success',
                        fetchStatus: 'idle'
                    }
                case 'failed':
                    return {
                        ...state,
                        fetchFailureCount: state.fetchFailureCount + 1,
                    }
                case 'error':
                    return {
                        ...state,
                        error: action.error,
                        errorUpdateCount: state.errorUpdateCount + 1,
                        fetchFailureCount: state.fetchFailureCount + 1,
                        status: 'error',
                        fetchStatus: 'idle'
                    }
                case 'pause':
                    return {
                        ...state,
                        fetchStatus: 'paused',
                    }
                case 'continue':
                    return {
                        ...state,
                        fetchStatus: 'fetching',
                    }
            }
        }

        this.state = reducer(this.state) //修改query的state
        console.log('dispatch成功  更改state, Action:', action);

        // 通知所有的observer  state更新了  observer重新渲染组件
        this.observers.forEach((observer) => {
            observer.onQueryUpdate(action)
        })

    }
}