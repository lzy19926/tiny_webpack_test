// 同步hook,call时会按顺序执行内部的所有回调函数

const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");

class SyncHookCodeFactory extends HookCodeFactory {
    content() { return this.callTapsSeries() }
}

const factory = new SyncHookCodeFactory();


const NO_TAP_ASYNC = () => {
    throw new Error("tapAsync在SyncHook中无法使用, tapAsync is not supported on a SyncHook");
};

const NO_TAP_PROMISE = () => {
    throw new Error("tapPromise在SyncHook中无法使用,tapPromise is not supported on a SyncHook");
};

class SyncHook extends Hook {
    compile(options) {
        factory.setup(this, options);
        return factory.create(options);
    }
    tapAsync = NO_TAP_ASYNC;
    tapPromise = NO_TAP_PROMISE;
}


module.exports = SyncHook
