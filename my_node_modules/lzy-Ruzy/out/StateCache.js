"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateCache = void 0;
const StateObserver_1 = require("./StateObserver");
const utils_1 = require("./utils");
const LzyReact = __importStar(require("../../lzy-React/out/index_V3"));
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
    useBaseState(...keys) {
        // 给组件创建一个observer
        const [observer] = LzyReact.myUseState(new StateObserver_1.StateObserver(this, keys));
        //todo监视keys变更
        LzyReact.myUseEffect(() => { }, keys);
        // 注册组件更新方法
        const reRenderer = LzyReact.myUseState(undefined)[1];
        observer.subscribe(reRenderer);
        this.observers.push(observer);
        return observer.createResult(keys);
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
