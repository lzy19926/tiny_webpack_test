"use strict";
// 发布订阅类方法   当下的Listener是一个函数
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribable = void 0;
class Subscribable {
    constructor() {
        this.listeners = new Set();
        this.subscribe = this.subscribe.bind(this);
    }
    // subscribe方法返回一个unSubscribe方法(因为可以通过闭包访问到该listener)
    subscribe(listener) {
        this.listeners.add(listener);
        this.onSubscribe();
        return () => {
            this.listeners.delete(listener);
            this.onUnsubscribe();
        };
    }
    hasListeners() {
        return Object.keys(this.listeners).length > 0;
    }
    // 订阅回调
    onSubscribe() {
        // Do nothing
    }
    // 取消订阅回调
    onUnsubscribe() {
        // Do nothing
    }
}
exports.Subscribable = Subscribable;
