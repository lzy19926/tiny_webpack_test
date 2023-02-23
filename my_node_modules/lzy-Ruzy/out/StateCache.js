"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateCache = void 0;
const StateObserver_1 = require("./StateObserver");
const utils_1 = require("./utils");
const lzy_react_1 = __importDefault(require("lzy-react"));
// import React from 'react'
//!  StateCache保存了全局state,并提供了调用state的方法
class StateCache {
    constructor(initState) {
        this._states = {};
        this.observers = [];
        this.initState(initState);
    }
    initState(initState) {
        if (!(0, utils_1.isPlainObject)(initState)) {
            throw new Error('init state is not a plain object');
        }
        this._states = initState;
    }
    getState(key) {
        return this._states[key];
    }
    getAllState() {
        return this._states;
    }
    //! 同时兼容LzyReact和React的API
    useBaseState(...keys) {
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
        if (typeof lzy_react_1.default !== 'undefined') {
            // 给组件创建一个observer
            const [observer] = lzy_react_1.default.myUseState(new StateObserver_1.StateObserver(this, keys));
            //todo监视keys变更
            lzy_react_1.default.myUseEffect(() => { }, keys);
            // 注册组件更新方法
            const reRenderer = lzy_react_1.default.myUseState(undefined)[1];
            observer.subscribe(reRenderer);
            this.observers.push(observer);
            return observer.createResult(keys);
        }
        else {
            console.error('lzy-ruzy 需要运行在react或lzy-react框架上');
        }
    }
    ;
    setBaseState(param) {
        const needUpdateKeys = [];
        Object.keys(param).forEach((key) => {
            if (this._states[key] !== param[key]) {
                this._states[key] = param[key];
                needUpdateKeys.push(key);
            }
        });
        // 合并执行setState
        this.observers.forEach((ob) => {
            ob.updateByKeys(needUpdateKeys);
        });
    }
}
exports.StateCache = StateCache;
