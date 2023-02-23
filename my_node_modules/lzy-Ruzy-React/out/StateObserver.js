"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateObserver = void 0;
const subscribable_1 = require("./subscribable");
// 一个StateObserver可以监听多个State
// 每个使用useState的组件都会创建一个observer  用于对组件进行更新
// Observer用于判断变量是否发生变化并通知组件
class StateObserver extends subscribable_1.Subscribable {
    constructor(stateCache, keys) {
        super();
        this.stateCache = stateCache;
        this.usedStates = keys;
    }
    createResult(keys) {
        const result = {};
        this.usedStates = keys;
        keys.forEach((key) => {
            const value = this.stateCache.getState(key);
            result[key] = value;
        });
        return result;
    }
    updateByKeys(keys) {
        let needUpdate = false;
        keys.forEach((key) => {
            if (this.usedStates.indexOf(key) !== -1) {
                needUpdate = true;
            }
        });
        if (needUpdate) {
            this.updateComponent();
        }
    }
    updateComponent() {
        this.listeners.forEach((listener) => {
            listener(this.usedStates); //todo优化点: 如果前后usedStates未变化 则即便触发了也不会render页面
        });
    }
}
exports.StateObserver = StateObserver;
