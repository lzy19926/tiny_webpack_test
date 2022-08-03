"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rekv = void 0;
const useState_1 = require("../myHook/useState");
const useEffect_1 = require("../myHook/useEffect");
// ----------------------使用的工具函数0-------------------
const utils_1 = require("./utils");
class Rekv {
    // 构造函数
    constructor(args) {
        this.delegate = {}; // 拦截器
        this._events = {}; // 键值对  根据不同key存放对应的updater数组
        this._updateId = 0; // updater的ID 用于优化类组件
        this._state = {}; // 全局state
        this._inDelegate = false; // 拦截器相关
        //todo ---------传入state的key  使用useEffect监听_state中的[key] ---------------- 
        this.useState = (...keys) => {
            const [value, setValue] = (0, useState_1.myUseState)(this._state); //!_state对象
            //声明updater   
            const updater = () => {
                setValue(this._state);
            };
            //todo 监听keys数组  对其中每个添加/删除listener(on/off)
            (0, useEffect_1.myUseEffect)(() => {
                for (let i = 0, len = keys.length; i < len; i++) {
                    this.on(keys[i], updater);
                }
                return () => {
                    for (let i = 0, len = keys.length; i < len; i++) {
                        this.off(keys[i], updater);
                    }
                };
            }, keys);
            return this._state; //todo 直接返回当前状态
        };
        if (!(0, utils_1.isPlainObject)(args.allStates)) {
            throw new Error('init state is not a plain object');
        }
        this._state = args.allStates;
        const effects = {};
        // 如果传入了effect项  则遍历里面的函数并call  
        if (args.effects) {
            const effectKeys = Object.keys(args.effects);
            for (let i = 0, len = effectKeys.length; i < len; i++) {
                const key = effectKeys[i];
                const func = args.effects[key];
                args.effects[key] = (...args) => func.call(this, ...args); //bind
            }
        }
        // 绑定effects到实例上
        this.effects = args.effects || effects;
    }
    //todo 使用添加一个listener(callback)  cb类型为<initState[K]>
    //todo 每次执行on 都会往_event中推入一个[name]:updater项
    on(name, callback) {
        const s = this._events[name]; // _events =  {'name':undefined}
        if (!s) { // 如果event中没有[name]属性  则将callback作为数组存入_event[name]
            this._events[name] = [callback]; // _events =  {'name':[setValue(name1),setValue(name2)]}
        }
        else if (s.indexOf(callback) < 0) { // 如果有[name]属性  且其中无cb  则存入cb
            s.push(callback);
        }
    }
    // 从_event[name]中移除callback(listener)
    off(name, callback) {
        const s = this._events[name];
        this._events[name] = [callback];
        if (s) {
            const index = s.indexOf(callback);
            if (index >= 0) {
                s.splice(index, 1);
            }
        }
    }
    //! --------- 两种setState方法  传入{...states} 或者(state)=> ({...states})---------
    setState(param) {
        let kvs; // {...states}
        //todo 将state保存到kvs上
        if ((0, utils_1.isFunction)(param)) {
            kvs = param(this._state);
        }
        else {
            kvs = param;
        }
        //todo 开启beforeUpdate拦截器(无则不开启)  执行对应逻辑
        if (!this._inDelegate) {
            this._inDelegate = true;
            if (this.delegate && (0, utils_1.isFunction)(this.delegate.beforeUpdate)) {
                const ret = this.delegate.beforeUpdate({ store: this, state: kvs });
                if (ret) {
                    kvs = ret;
                }
            }
            if (Rekv.delegate && (0, utils_1.isFunction)(Rekv.delegate.beforeUpdate)) {
                const ret = Rekv.delegate.beforeUpdate({ store: this, state: kvs });
                if (ret) {
                    kvs = ret;
                }
            }
            this._inDelegate = false;
        }
        //todo 传入的states对象做类型判断
        if (!(0, utils_1.isPlainObject)(kvs)) { // {...states}
            throw new Error('setState() only receive an plain object');
        }
        const keys = Object.keys(kvs);
        const needUpdateKeys = [];
        const updatedValues = {};
        //todo 前后states对象进行遍历对比(for循环)  
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            if (this._state[key] !== kvs[key]) { //todo 不同的属性
                needUpdateKeys.push(key); // key推入needUpdateKeys数组 //!最小量更新
                updatedValues[key] = kvs[key]; // value推入updatedValue数组
                this._state[key] = kvs[key]; // 更新_state
            }
        }
        //todo 如果有需要更新的state（needUpdateKeys.length > 0）
        if (needUpdateKeys.length > 0) {
            this._state = Object.assign({}, this._state); // 拷贝
            this.updateComponents(...needUpdateKeys);
        }
        //todo 开启afterUpdate拦截器(无则不开启)  执行对应逻辑
        if (!this._inDelegate) {
            this._inDelegate = true;
            if (this.delegate && (0, utils_1.isFunction)(this.delegate.afterUpdate)) {
                this.delegate.afterUpdate({ store: this, state: updatedValues });
            }
            if (Rekv.delegate && (0, utils_1.isFunction)(Rekv.delegate.afterUpdate)) {
                Rekv.delegate.afterUpdate({ store: this, state: updatedValues });
            }
            this._inDelegate = false;
        }
    }
    //todo 作为对象的getter
    get currentState() {
        return this._state;
    }
    //todo------------ 直接返回_state----------------------
    getCurrentState() {
        return this._state;
    }
    //todo -------------更新组件  传入needUpdate数组的keys---------------------
    updateComponents(...keys) {
        //todo batch函数将内部所有的setValue合并到一个setValue执行(react底层方法)
        //! 暂时废弃
        for (let i = 0, keysLen = keys.length; i < keysLen; i++) {
            const key = keys[i]; //'name'
            //todo 每次执行on 都会往_event中推入一个[name]:updater项
            const updaters = this._events[key]; //取出该key的updater
            if (Array.isArray(updaters)) {
                for (let j = 0, updaterLen = updaters.length; j < updaterLen; j++) {
                    const updater = updaters[j];
                    // check whether the updater has been updated, the same updater may watch different keys
                    updater.updateId = this._updateId; //! 隐式挂一个id属性
                    updater(this._state[key]);
                }
            }
        }
        //todo----------- 每次更新id++  防止栈溢出----------------------
        this._updateId++;
        // istanbul ignore next
        if (this._updateId >= 2147483647) {
            // _updateId will be reset to zero to avoid overflow (2147483647 is 2**31-1)
            this._updateId = 0;
        }
    }
}
exports.Rekv = Rekv;
// 定义类中需要使用的数据
Rekv.delegate = {};
exports.default = Rekv;
