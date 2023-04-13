

// HookCodeFactory主要用于创建不同类型的钩子函数，包括同步、异步、带有返回值等类型。
// 它可以根据传递给它的参数自动生成钩子函数的代码，并将其存储在内部缓存中以提高性能。

// 这个工厂还提供了一些基本的代码块，例如解析参数和调用所有挂载的监听器。
// 通过使用这些基本代码块，它可以生成高度优化的钩子函数代码，以便更快地运行。

//! 主要作用, 通过配置  拼接生成回调函数字符串,taps存放在

"use strict";

class HookCodeFactory {
    constructor(config) {
        this.config = config;
        this.options = undefined;
        this._args = undefined
    }

    // 初始化/反初始化options
    init(options) {
        this._args = options.args
        this.options = options
    }

    deInit() {
        this._args = undefined
        this.options = undefined
    }

    // 赋值taps的fn到_x上
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(t => t.fn);
    }

    // 创建一个新的钩子函数 三种type  : sync,async,promise  外层Hook的call系列方法就会从这里创建函数
    create(options) {
        this.init(options)

        let fn;
        let type = this.options.type

        switch (type) {
            case "sync": fn = this.createSyncCallBack()
                break;
            case "async": fn = this.createAsyncCallBack()
                break;
            case "promise": fn = this.createPromiseCallBack()
                break;
        }

        this.deInit()

        return fn
    }

    // 构造同步回调函数字符串
    createSyncCallBack() {
        const args = this.createArgs()
        const fnContent =
            '"use strict"; \n' +
            this.header() +
            this.content()
        return new Function(args, fnContent)
    }
    // 构造异步回调函数字符串
    createAsyncCallBack() {
        const args = this.createArgs("_callback")
        const fnContent =
            '"use strict"; \n' +
            this.header() +
            this.content()
        return new Function(args, fnContent)
    }
    // 构造Promise回调函数字符串
    createPromiseCallBack() { }


    createArgs(...otherArgs) {
        let allArgs = this._args?.concat(otherArgs) || [];
        return allArgs.length === 0
            ? ""
            : allArgs.join(", ")
    }

    // 构造函数上半部分
    header() {
        let code = ''
        let injectTaps = "var _x = this._x;\n"

        code += injectTaps
        return code
    }

    // 构造函数中间部分(抽象方法,在构造CodeFactory时实现)
    content() {
        throw new Error("Abstract: content方法应被实现");
    }

    // 将所有的回调函数组装进code里
    callTap(tapIndex) {
        let i = tapIndex
        let code = ''

        let args;
        let varible;
        let body;

        let doDone = i == this.options.taps.length - 1
        const type = this.options.taps[i].type;

        switch (type) {
            case "sync":
                args = this._args
                varible = `var _fn${i} = _x[${i}];\n`
                body = `_fn${i}(${args});\n`;

                code = varible + body
                break;
            case "async":
                const _callback = doDone  // 结束时执行最终回调
                    ? `(function () { if (_callback) { _callback() } })`
                    : `(function () { if (_next${i}) { _next${i}() } })`;

                args = this._args
                varible = `var _fn${i} = _x[${i}];\n`
                body = `_fn${i}(${args},${_callback});\n`;

                code = varible + body
                if (i > 0) {// 进行_next函数包裹
                    code = `function _next${i - 1}() { \n ${code} }`
                }
                break;
            case "promise":
                break;
        }


        return code
    }

    callTapsSeries() {
        let code = ""
        let taps = this.options.taps
        const shouldReverse = this.options.type === 'sync'

        const workLoop = (i) => {
            const content = this.callTap(i)
            code = code + content + "\n"
        }
        // sync情况下,需要按照0 1 2的顺序推入代码,而async时倒序
        if (shouldReverse) {
            for (let i = 0; i < taps.length; i++) { workLoop(i) }
        } else {
            for (let i = taps.length - 1; i >= 0; i--) { workLoop(i) }
        }

        return code
    }

    callTapsLooping() { }

    callTapsParallel() { }
}


module.exports = HookCodeFactory;