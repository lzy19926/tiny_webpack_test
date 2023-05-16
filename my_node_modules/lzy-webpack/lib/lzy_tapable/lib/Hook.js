
"use strict";

class Hook {

    constructor(args, name) {
        this.taps = [];
        this.name = name;
        this._args = args;
        this.addtionalOptions = {} // 额外配置

        this.call = this.call;
        this.callAsync = this.callAsync;
        this.promise = this.promise;

        this.tap = this.tap;
        this.tapAsync = this.tapAsync;
        this.tapPromise = this.tapPromise;
        // hook中缓存了传入的回调函数,以便CodeFactory调用(CodeFactory会生成 var fn = this._x[0] 这样的代码)
        this._x = []
    }

    // 抽象方法,需要在基于Hook创建的其他Hook中被实现(ES5实现抽象方法)
    compile() {
        throw new Error("Abstract: compile方法应被实现");
    }

    // call方法系列(_createCall调用CodeFactory,生成对应的函数字符串,通过字符串+new Function创建函数)
    _createCall(type) {
        return this.compile({
            type: type,
            args: this._args,
            taps: this.taps,
        })
    }

    call(...args) {
        this._createCall("sync").call(this, ...args)
    }

    callAsync(...args) {
        this._createCall("async").call(this, ...args)
    }

    promise(...args) {
        this._createCall("promise").call(this, ...args)
    }

    // tap方法系列  _tap:推入函数到_x中  tap tapAsync tapPromise分别tap为三种不同的函数
    _tap(type, name, fn) {
        if (typeof name !== "string" || name === "") {
            throw new Error("Missing name for tap");
        }
        //todo 检查before/stage配置

        let tap = Object.assign({ type, fn }, { name });

        this.taps.push(tap)
    }

    tap(name, fn) {
        this._tap("sync", name, fn);
    }

    tapAsync(name, fn) {
        this._tap("async", name, fn);
    }

    tapPromise(name, fn) {
        this._tap("promise", name, fn);
    }

    // unTap方法系列  删除回调函数
    unTap() {
        this.taps.pop()
    }

    unTapAll() {
        while (this.taps.length) {
            this.taps.pop()
        }
    }

    //todo 添加hook配置
    withOptions({ before, stage }) {
        Object.assign(this.addtionalOptions, { before }, { stage })
        return this
    }

    //是否使用
    isUsed() {
        return this.taps.length > 0
    }
}

module.exports = Hook