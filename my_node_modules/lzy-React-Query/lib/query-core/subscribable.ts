// 发布订阅类方法   当下的Listener是一个函数

export type Listener = Function
export class Subscribable {
    listeners: Set<Listener>
    constructor() {
        this.listeners = new Set()
        this.subscribe = this.subscribe.bind(this)
    }

    // subscribe方法返回一个unSubscribe方法(因为可以通过闭包访问到该listener)
    subscribe(listener: Listener): () => void {
        this.listeners.add(listener)
        this.onSubscribe()
        return () => {
            this.listeners.delete(listener)
            this.onUnsubscribe()
        }
    }

    hasListeners(): boolean {
        return Object.keys(this.listeners).length > 0
    }

    // 订阅回调
    protected onSubscribe(): void {
        // Do nothing
    }
    // 取消订阅回调
    protected onUnsubscribe(): void {
        // Do nothing
    }
}