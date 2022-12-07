import { sleep } from './utils'

interface RetryerConfig {
    fn: () => Promise<any>
    abort?: () => void
    onError?: (error: Error) => void
    onSuccess?: (data: any) => void
    onFail?: (error: Error) => void
    onPause?: () => void
    onContinue?: () => void
    retry?: boolean | number
    retryDelay?: number
}


//TODO  createRetryer会执行run方法  开始查询循环 
//TODO  如果接收到数据  执行自己封装的resolve/reject 自己封装的resolve/reject会先执行回调  然后执行外部.then中定义的resolve和reject
//todo  执行自己封装的resolve/reject会改变 isResolved状态 用于停止循环
//todo  如果没有正常获得数据  不会执行自己封装的resolve/reject  此时会进入retry逻辑 重复发起请求  达到上限后直接执行reject  停止请求
//todo  这里相当于截断了promise的执行流程   执行res之前先执行回调

export function createRetryer(config: RetryerConfig) {
    let isRetryCancelled = false
    let failureCount = 0
    let isResolved = false   //执行了自定义的res或rej后会改变  之后不会继续执行
    let promiseResolve = (value: any) => { }
    let promiseReject = (value: any) => { }

    //todo 截断promise执行流程
    //outerResolve是Promise的执行器函数  会执行所有的.then中定义的onResolved函数
    const promise = new Promise<any>((outerResolve, outerReject) => {
        promiseResolve = outerResolve
        promiseReject = outerReject
    }).catch((err) => { //! 在这里将Promise的错误抛出
        console.error(err)
    })

    // 这里重新封装了resolve和reject(执行器函数)
    //!首先保存原本的resolve和reject，在执行原本的resolve和reject之前先改变retryer的状态 并执行相应的回调(onsuccess,onfail)
    const resolve = (value: any) => {  // 完成执行resolve  改变状态并返回
        if (isResolved) return
        isResolved = true
        config.onSuccess?.(value)
        promiseResolve(value) // 执行后续.then中定义的onResolve函数
    }
    const reject = (value: any) => {   // 完成执行reject  改变状态并返回
        if (isResolved) return
        isResolved = true
        config.onError?.(value)
        promiseReject(value)// 执行所有.catch中定义的onReject函数
    }

    const run = () => { // 启动retryer会执行run方法   开始查询循环   中途如果出现变化(接收到数据)  返回数据或做其他处理
        if (!shouldRun()) return
        // 执行函数  获取结果或者抛出promise错误
        let promiseOrValue;
        try {
            console.log('--------tryFetch/retryFetch-------');
            promiseOrValue = config.fn() //!Promise.resolve()  执行queryFn 
        } catch (err) {
            promiseOrValue = Promise.reject(err)
        }

        // 将结果丢入promise继续循环
        Promise.resolve(promiseOrValue)
            .then(resolve) // 首先调用resolve返回结果
            .catch((error) => {   // 如果捕获到请求错误，retry
                if (!shouldRetry()) return reject(error)
                if (isResolved) return
                retry(error)
            })
    }
    const retry = (error: any) => {
        // 如果需要重复  计数器++ 执行onFail回调
        const delay = config.retryDelay || 3000
        failureCount++
        config.onFail?.(error)
        // 延迟后再次执行请求
        sleep(delay).then(() => {
            run()
        })
    }
    const shouldRun = () => {
        return !isResolved && !isRetryCancelled
    }
    const shouldRetry = () => {// 如果重复次数到上限 或者 配置为false  或者retry取消了 不执行retry
        const retry = config.retry ?? 3
        const shouldRetry = !isRetryCancelled && (config.retry === true || failureCount < retry)
        return shouldRetry
    }
    const cancleRetry = () => {
        isRetryCancelled = true
    }
    const continueRetry = () => {
        isRetryCancelled = false
    }

    // 开始执行循环
    run()

    return {
        promise,
        cancleRetry,
        continueRetry
    }
}