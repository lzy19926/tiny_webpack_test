import { StateObserver } from './StateObserver'
import { isPlainObject } from './utils'
import LzyReact from 'lzy-react'
// import React from 'react'
//!  StateCache保存了全局state,并提供了调用state的方法

export class StateCache {
    _states: Record<string, any>
    observers: StateObserver[]
    constructor(initState: any) {
        this._states = {}
        this.observers = []
        this.initState(initState)
    }

    initState(initState: any) {
        if (!isPlainObject(initState)) {
            throw new Error('init state is not a plain object');
        }
        this._states = initState
    }

    getState(key: string) {
        return this._states[key]
    }

    getAllState() {
        return this._states
    }
    //! 同时兼容LzyReact和React的API
    useBaseState(...keys: string[]) {

        // if (typeof React !== 'undefined') {
        //     // 给组件创建一个observer
        //     const [observer] = React.useState(new StateObserver(this, keys))
        //     //todo监视keys变更
        //     React.useEffect(() => { }, keys)
        //     // 注册组件更新方法
        //     const reRenderer = React.useState(undefined)[1]
        //     observer.subscribe(reRenderer)

        //     this.observers.push(observer)

        //     return observer.createResult(keys)
        // }

        if (typeof LzyReact !== 'undefined') {
            // 给组件创建一个observer
            const [observer] = LzyReact.myUseState(new StateObserver(this, keys))
            //todo监视keys变更
            LzyReact.myUseEffect(() => { }, keys)
            // 注册组件更新方法
            const reRenderer = LzyReact.myUseState(undefined)[1]
            observer.subscribe(reRenderer)

            this.observers.push(observer)

            return observer.createResult(keys)
        }

        else {
            console.error('lzy-ruzy 需要运行在react或lzy-react框架上')
        }
    };

    setBaseState(param: any) {
        const needUpdateKeys: string[] = []

        Object.keys(param).forEach((key: string) => {
            if (this._states[key] !== param[key]) {
                this._states[key] = param[key]
                needUpdateKeys.push(key)
            }
        })
        // 合并执行setState
        this.observers.forEach((ob) => {
            ob.updateByKeys(needUpdateKeys)
        })
    }
}