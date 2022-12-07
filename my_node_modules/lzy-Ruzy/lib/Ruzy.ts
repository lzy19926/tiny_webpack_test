import type { InitState, SetStateParam } from './type'
import { StateCache } from './StateCache'


// 暴露给用户调用的类
export default class Ruzy {
    private store: StateCache | undefined

    constructor(initState: InitState) {
        this.store = new StateCache(initState)
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
}



