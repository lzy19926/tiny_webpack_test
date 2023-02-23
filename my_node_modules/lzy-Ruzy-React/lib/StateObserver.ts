import { Subscribable } from "./subscribable";
import { StateCache } from './StateCache'

// 一个StateObserver可以监听多个State
// 每个使用useState的组件都会创建一个observer  用于对组件进行更新
// Observer用于判断变量是否发生变化并通知组件
export class StateObserver extends Subscribable {
    stateCache: StateCache
    usedStates: string[]
    constructor(stateCache: StateCache, keys: string[]) {
        super()
        this.stateCache = stateCache
        this.usedStates = keys
    }

    createResult(keys: string[]) {
        const result: Record<string, any> = {}
        this.usedStates = keys

        keys.forEach((key: string) => {
            const value = this.stateCache.getState(key)
            result[key] = value
        })

        return result
    }

    updateByKeys(keys: string[]) {
        let needUpdate: boolean = false

        keys.forEach((key) => {
            if (this.usedStates.indexOf(key) !== -1) {
                needUpdate = true
            }
        })

        if (needUpdate) {
            this.updateComponent()
        }
    }

    updateComponent() { // 给listeners发送通知 进行组件更新 (这里的Listener就是React的setState  调用执行组件render)
        this.listeners.forEach((listener) => {
            listener(this.usedStates)  //todo优化点: 如果前后usedStates未变化 则即便触发了也不会render页面
        })
    }
}